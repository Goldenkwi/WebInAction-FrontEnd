"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ApiError, apiRequest, type User } from "@/lib/backend";
import { useAuth, useTheme } from "@/components/providers/AppProviders";
import Alert from "@/components/ui/Alert";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
	const isRegister = mode === "register";
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const { user, isLoading, error: sessionError, refreshUser } = useAuth();
	const { isLightTheme } = useTheme();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && user) {
			const requestedDestination = new URLSearchParams(
				window.location.search,
			).get("next");
			const destination =
				requestedDestination?.startsWith("/") &&
				!requestedDestination.startsWith("//")
					? requestedDestination
					: "";
			router.replace(
				destination ||
					(user.role === "citizen" ? "/my-reports" : "/admin"),
			);
		}
	}, [isLoading, router, user]);

	if (isLoading) {
		return (
			<div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
				Memeriksa sesi...
			</div>
		);
	}

	if (user) {
		return null;
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		setIsSubmitting(true);

		try {
			if (isRegister) {
				await apiRequest<{ user: User }>("auth/register", {
					method: "POST",
					body: JSON.stringify({
						name: name.trim(),
						email: email.trim(),
						password,
						password_confirmation: passwordConfirmation,
					}),
				});
			} else {
				await apiRequest<{ user: User }>("auth/login", {
					method: "POST",
					body: JSON.stringify({ email: email.trim(), password }),
				});
			}

			const signedInUser = await refreshUser();
			if (!signedInUser) {
				throw new ApiError(
					"Autentikasi berhasil, tetapi sesi tidak dapat dipulihkan. Silakan coba masuk kembali.",
					401,
				);
			}

			const requestedDestination = new URLSearchParams(
				window.location.search,
			).get("next");
			const destination =
				requestedDestination?.startsWith("/") &&
				!requestedDestination.startsWith("//")
					? requestedDestination
					: "";
			router.replace(
				destination ||
					(signedInUser.role === "citizen" ? "/my-reports" : "/admin"),
			);
			router.refresh();
		} catch (cause) {
			setError(
				cause instanceof Error
					? cause.message
					: "Permintaan tidak berhasil. Silakan coba lagi.",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="w-full max-w-md">
			<Link href="/" className="mb-8 inline-flex items-center gap-3">
				<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white">
					<svg
						className="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.8"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 3 19 6v5c0 4.5-2.8 8-7 10-4.2-2-7-5.5-7-10V6l7-3Z"
						/>
						<path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
					</svg>
				</span>
				<span>
					<span className="block text-sm font-bold">ADUAN PUBLIK</span>
					<span className="block text-[10px] uppercase tracking-[0.16em] text-slate-500">
						Disposisi berbasis AI
					</span>
				</span>
			</Link>

			<div
				className={`rounded-2xl border p-5 shadow-xl sm:p-7 ${
					isLightTheme
						? "border-slate-200 bg-white shadow-slate-200/50"
						: "border-white/[0.07] bg-[#101827] shadow-black/20"
				}`}
			>
				<p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-500">
					{isRegister ? "Portal warga" : "Selamat datang kembali"}
				</p>
				<h1 className="mt-1 text-xl font-semibold">
					{isRegister ? "Buat akun warga" : "Masuk ke akun Anda"}
				</h1>
				<p className={`mt-2 text-xs leading-relaxed ${
					isLightTheme ? "text-slate-500" : "text-slate-400"
				}`}>
					{isRegister
						? "Daftar untuk membuat laporan dan memantau perkembangannya."
						: "Gunakan akun terdaftar untuk mengakses layanan pelaporan."}
				</p>
				{sessionError && (
					<div className="mt-4">
						<Alert message={sessionError} />
					</div>
				)}

				<form onSubmit={handleSubmit} className="mt-6 space-y-4">
					{isRegister && (
						<label className="block">
							<span className="mb-1.5 block text-xs font-medium">Nama lengkap</span>
							<input
								required
								minLength={3}
								maxLength={100}
								autoComplete="name"
								value={name}
								onChange={(event) => setName(event.target.value)}
								className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400 ${
									isLightTheme
										? "border-slate-200 bg-white"
										: "border-white/10 bg-slate-950/50"
								}`}
							/>
						</label>
					)}
					<label className="block">
						<span className="mb-1.5 block text-xs font-medium">Email</span>
						<input
							required
							type="email"
							maxLength={150}
							autoComplete="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400 ${
								isLightTheme
									? "border-slate-200 bg-white"
									: "border-white/10 bg-slate-950/50"
							}`}
						/>
					</label>
					<label className="block">
						<span className="mb-1.5 block text-xs font-medium">Password</span>
						<input
							required
							type="password"
							minLength={isRegister ? 8 : undefined}
							maxLength={isRegister ? 72 : undefined}
							autoComplete={isRegister ? "new-password" : "current-password"}
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400 ${
								isLightTheme
									? "border-slate-200 bg-white"
									: "border-white/10 bg-slate-950/50"
							}`}
						/>
						{isRegister && (
							<span className="mt-1 block text-[10px] text-slate-500">
								8–72 karakter.
							</span>
						)}
					</label>
					{isRegister && (
						<label className="block">
							<span className="mb-1.5 block text-xs font-medium">
								Konfirmasi password
							</span>
							<input
								required
								type="password"
								minLength={8}
								maxLength={72}
								autoComplete="new-password"
								value={passwordConfirmation}
								onChange={(event) => setPasswordConfirmation(event.target.value)}
								className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400 ${
									isLightTheme
										? "border-slate-200 bg-white"
										: "border-white/10 bg-slate-950/50"
								}`}
							/>
						</label>
					)}

					{error && <Alert message={error} />}
					<button
						type="submit"
						disabled={isSubmitting}
						className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-wait disabled:opacity-60"
					>
						{isSubmitting && (
							<span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
						)}
						{isSubmitting
							? "Memproses..."
							: isRegister
								? "Daftar sebagai warga"
								: "Masuk"}
					</button>
				</form>

				<div className={`mt-5 border-t pt-4 text-center text-xs ${
					isLightTheme ? "border-slate-100 text-slate-500" : "border-white/[0.06] text-slate-400"
				}`}>
					{isRegister ? "Sudah memiliki akun?" : "Belum memiliki akun?"}{" "}
					<Link
						href={isRegister ? "/login" : "/register"}
						className="font-semibold text-indigo-500 hover:text-indigo-400"
					>
						{isRegister ? "Masuk" : "Daftar"}
					</Link>
				</div>
			</div>

			{!isRegister && (
				<div className={`mt-4 rounded-xl border p-4 text-xs ${
					isLightTheme
						? "border-slate-200 bg-white text-slate-600"
						: "border-white/[0.06] bg-white/[0.02] text-slate-300"
				}`}>
					<p className="font-semibold">Akun demo backend</p>
					<div className="mt-2 grid gap-2 text-[11px] sm:grid-cols-2">
						{[
							["Warga", "warga@example.com"],
							["Verifikator", "verifier@example.com"],
							["Admin instansi", "agency@example.com"],
						].map(([label, demoEmail]) => (
							<button
								key={demoEmail}
								type="button"
								onClick={() => {
									setEmail(demoEmail);
									setPassword("password123");
								}}
								className={`rounded-lg border px-2.5 py-2 text-left transition ${
									isLightTheme
										? "border-slate-200 hover:border-indigo-300"
										: "border-white/[0.06] hover:border-indigo-400/30"
								}`}
							>
								<span className="block font-medium">{label}</span>
								<span className="mt-0.5 block text-slate-500">{demoEmail}</span>
							</button>
						))}
					</div>
					<p className="mt-2 text-[10px] text-slate-500">
						Klik akun untuk mengisi email dan password demo.
					</p>
				</div>
			)}
		</div>
	);
}
