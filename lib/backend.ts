export type UserRole = "citizen" | "verifier_admin" | "agency_admin";

export interface User {
	id: number;
	name: string;
	email?: string;
	role: UserRole;
	role_label: string;
	created_at?: string;
}

export interface Category {
	id: number;
	name: string;
	icon: string | null;
	reports_count?: number;
}

export type ReportStatus = "pending" | "verified" | "followed_up" | "rejected";
export type ReportPriority = "rendah" | "sedang" | "tinggi" | "darurat";

export interface Report {
	id: number;
	ticket_number: string;
	title: string;
	description?: string;
	report_type: "pengaduan" | "aspirasi";
	status: ReportStatus;
	status_label: string;
	priority: ReportPriority | null;
	priority_label: string | null;
	reporter_name: string | null;
	category: Pick<Category, "id" | "name" | "icon"> | null;
	location_text: string;
	incident_date: string | null;
	image_url: string | null;
	is_anonymous: boolean;
	is_private: boolean;
	ai_analysis: {
		predicted_category_id: number | null;
		predicted_category_name: string | null;
		confidence: number | null;
		confidence_score?: number | null;
		auto_disposed?: boolean;
		is_corrected: boolean;
		predicted_priority: ReportPriority | null;
		priority_confidence: number | null;
	};
	timeline_logs?: ReportLog[];
	created_at: string;
	updated_at?: string;
}

export interface ReportLog {
	id: number;
	status: ReportStatus;
	status_label: string;
	note: string | null;
	changed_by_name: string;
	changed_by_role: UserRole | null;
	proof_img: string | null;
	created_at: string;
	created_at_label: string;
}

export interface ReportCreationResult {
	id: number;
	ticket_number: string;
	title: string;
	report_type: "pengaduan" | "aspirasi";
	status: ReportStatus;
	status_label: string;
	is_anonymous: boolean;
	is_private: boolean;
	priority: ReportPriority | null;
	ai_analysis: {
		predicted_category_id: number | null;
		predicted_category_name: string | null;
		confidence_score: number | null;
		auto_disposed: boolean;
		predicted_priority: ReportPriority | null;
		priority_confidence: number | null;
	};
	created_at: string;
}

export interface PaginationMeta {
	current_page: number;
	per_page: number;
	total: number;
	last_page: number;
}

export interface DashboardStats {
	total_reports: number;
	pending_reports: number;
	completed_reports: number;
	average_resolution_days: number;
	verified_reports: number;
	rejected_reports: number;
	by_status: Array<{ status: ReportStatus; label: string; count: number }>;
	by_category: Array<{
		category_id: number;
		name: string;
		icon: string | null;
		count: number;
	}>;
	by_priority: Array<{
		priority: ReportPriority;
		label: string;
		count: number;
	}>;
}

export interface ApiEnvelope<T> {
	success: boolean;
	message: string;
	data: T;
	errors?: Record<string, string[]>;
	meta?: PaginationMeta;
}

export class ApiError extends Error {
	status: number;
	errors?: Record<string, string[]>;

	constructor(
		message: string,
		status: number,
		errors?: Record<string, string[]>,
	) {
		const details = errors ? Object.values(errors).flat() : [];
		super(details.length ? `${message} ${details.join(" ")}` : message);
		this.name = "ApiError";
		this.status = status;
		this.errors = errors;
	}
}

export async function apiRequest<T>(
	path: string,
	options: RequestInit = {},
): Promise<ApiEnvelope<T>> {
	const headers = new Headers(options.headers);
	const hasBody = options.body !== undefined && options.body !== null;
	if (hasBody && !(options.body instanceof FormData)) {
		headers.set("Content-Type", "application/json");
	}
	headers.set("Accept", "application/json");

	let response: Response;
	try {
		response = await fetch(`/api/backend/${path.replace(/^\/+/, "")}`, {
			...options,
			headers,
			cache: "no-store",
		});
	} catch {
		throw new ApiError(
			"Tidak dapat menghubungi aplikasi. Periksa koneksi lalu coba lagi.",
			0,
		);
	}

	let payload: ApiEnvelope<T>;
	try {
		payload = (await response.json()) as ApiEnvelope<T>;
	} catch {
		throw new ApiError(
			"Server mengirim respons yang tidak dapat dibaca.",
			response.status,
		);
	}

	if (!response.ok || !payload.success) {
		if (
			response.status === 401 &&
			!["auth/login", "auth/register", "auth/me"].includes(path)
		) {
			window.dispatchEvent(new Event("mia:session-expired"));
		}
		throw new ApiError(
			payload.message || "Permintaan tidak berhasil.",
			response.status,
			payload.errors,
		);
	}

	return payload;
}

export function toQueryString(
	values: Record<string, string | number | undefined>,
) {
	const query = new URLSearchParams();
	for (const [key, value] of Object.entries(values)) {
		if (value !== undefined && String(value).trim() !== "") {
			query.set(key, String(value));
		}
	}
	return query.toString();
}
