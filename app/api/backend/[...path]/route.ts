import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "mia_sanctum";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

type ApiEnvelope = {
	data?: {
		token?: string;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

async function proxyRequest(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const backendBaseUrl = process.env.LARAVEL_API_URL;
	if (!backendBaseUrl) {
		return NextResponse.json(
			{
				success: false,
				message: "LARAVEL_API_URL belum dikonfigurasi pada server.",
				data: null,
			},
			{ status: 503 },
		);
	}

	let backendUrl: URL;
	try {
		backendUrl = new URL(backendBaseUrl);
	} catch {
		return NextResponse.json(
			{
				success: false,
				message: "LARAVEL_API_URL harus berupa URL yang valid.",
				data: null,
			},
			{ status: 500 },
		);
	}

	if (
		process.env.NODE_ENV === "production" &&
		backendUrl.protocol !== "https:"
	) {
		return NextResponse.json(
			{
				success: false,
				message: "URL backend harus menggunakan HTTPS pada production.",
				data: null,
			},
			{ status: 500 },
		);
	}

	const { path } = await params;
	const backendPath = path.map(encodeURIComponent).join("/");
	const targetUrl = new URL(`/api/${backendPath}`, backendUrl);
	targetUrl.search = request.nextUrl.search;

	const headers = new Headers({
		Accept: "application/json",
	});
	const contentType = request.headers.get("content-type");
	if (contentType) headers.set("Content-Type", contentType);

	const isAuthenticationEntry =
		backendPath === "auth/login" || backendPath === "auth/register";
	const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;
	if (sessionToken && !isAuthenticationEntry) {
		headers.set("Authorization", `Bearer ${sessionToken}`);
	}

	const requestBody =
		request.method === "GET" || request.method === "HEAD"
			? undefined
			: await request.arrayBuffer();

	let backendResponse: Response;
	try {
		backendResponse = await fetch(targetUrl, {
			method: request.method,
			headers,
			body: requestBody,
			cache: "no-store",
		});
	} catch {
		return NextResponse.json(
			{
				success: false,
				message: "Tidak dapat terhubung ke server backend. Coba lagi nanti.",
				data: null,
			},
			{ status: 502 },
		);
	}

	const responseText = await backendResponse.text();
	const responseHeaders = new Headers({
		"Cache-Control": "no-store",
	});
	const responseType = backendResponse.headers.get("content-type");
	if (responseType) responseHeaders.set("Content-Type", responseType);

	const response = new NextResponse(responseText, {
		status: backendResponse.status,
		headers: responseHeaders,
	});

	if (backendResponse.status === 401) {
		response.cookies.delete(SESSION_COOKIE);
		return response;
	}

	if (isAuthenticationEntry && backendResponse.ok) {
		let envelope: ApiEnvelope;
		try {
			envelope = JSON.parse(responseText) as ApiEnvelope;
		} catch {
			return NextResponse.json(
				{
					success: false,
					message: "Backend mengirim respons autentikasi yang tidak valid.",
					data: null,
				},
				{ status: 502 },
			);
		}

		const token = envelope.data?.token;
		if (typeof token !== "string" || token.length === 0) {
			return NextResponse.json(
				{
					success: false,
					message: "Token autentikasi tidak ditemukan pada respons backend.",
					data: null,
				},
				{ status: 502 },
			);
		}

		const safeData = { ...envelope.data };
		delete safeData.token;
		responseHeaders.set(
			"Content-Type",
			"application/json; charset=utf-8",
		);
		const authenticatedResponse = new NextResponse(
			JSON.stringify({ ...envelope, data: safeData }),
			{
				status: backendResponse.status,
				headers: responseHeaders,
			},
		);
		authenticatedResponse.cookies.set(SESSION_COOKIE, token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: SESSION_MAX_AGE,
		});
		return authenticatedResponse;
	}

	if (backendPath === "auth/logout" && backendResponse.ok) {
		response.cookies.delete(SESSION_COOKIE);
	}

	return response;
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
