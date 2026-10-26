"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useTheme } from "@/components/providers/AppProviders";
import ReportCard from "@/components/ui/ReportCard";
import { apiRequest, type Report } from "@/lib/backend";

export default function PublicLanding() {
	const [reports, setReports] = useState<Report[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const { isLightTheme } = useTheme();

	useEffect(() => {
		let isMounted = true;
		apiRequest<Report[]>("reports/public?per_page=3")
			.then((response) => {
				if (isMounted) setReports(response.data);
			})
			.catch((cause: unknown) => {
				if (isMounted)
					setError(
						cause instanceof Error
							? cause.message
							: "Laporan publik gagal dimuat.",
					);
			})
			.finally(() => {
				if (isMounted) setIsLoading(false);
			});
		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<div
			className={`min-h-screen ${
				isLightTheme
					? "bg-slate-50 text-slate-900"
					: "bg-[#080d18] text-slate-100"
			}`}
		>
			<Header title="Portal Aduan Masyarakat" />
			<main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
				<section className="relative overflow-hidden py-16 sm:py-24">
					<div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
					<div className="relative max-w-3xl">
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
							Portal pelaporan masyarakat
						</p>
						<h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
							Suara Anda membantu{" "}
							<span className="text-indigo-500">membangun layanan</span> yang
							lebih baik.
						</h1>
						<p
							className={`mt-5 max-w-2xl text-sm leading-relaxed sm:text-base ${
								isLightTheme ? "text-slate-600" : "text-slate-400"
							}`}
						>
							Sampaikan pengaduan atau aspirasi secara aman. Sistem AI membantu
							mengklasifikasikan laporan, sementara petugas memastikan setiap
							laporan ditangani oleh instansi yang tepat.
						</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<Link
								href="/reports/new"
								className="rounded-lg bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
							>
								Buat laporan
							</Link>
							<Link
								href="/reports"
								className={`rounded-lg border px-5 py-3 text-sm font-semibold transition ${
									isLightTheme
										? "border-slate-200 hover:bg-white"
										: "border-white/10 hover:bg-white/5"
								}`}
							>
								Lihat laporan publik
							</Link>
						</div>
						<div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-xs text-slate-500">
							<span className="flex items-center gap-2">
								<span className="h-2 w-2 rounded-full bg-emerald-500" />
								Privasi pelapor terlindungi
							</span>
							<span className="flex items-center gap-2">
								<span className="h-2 w-2 rounded-full bg-indigo-500" />
								Pelacakan status transparan
							</span>
							<span className="flex items-center gap-2">
								<span className="h-2 w-2 rounded-full bg-amber-500" />
								Verifikasi oleh petugas
							</span>
						</div>
					</div>
				</section>

				<section className="grid gap-4 md:grid-cols-3" aria-label="Alur laporan">
					{[
						["01", "Sampaikan laporan", "Ceritakan masalah, waktu, dan lokasi kejadian."],
						["02", "AI membantu klasifikasi", "Model bahasa memberi rekomendasi kategori dan prioritas."],
						["03", "Petugas menindaklanjuti", "Pantau proses verifikasi hingga tindak lanjut."],
					].map(([number, title, description]) => (
						<article
							key={number}
							className={`rounded-xl border p-5 ${
								isLightTheme
									? "border-slate-200 bg-white"
									: "border-white/[0.06] bg-[#101827]"
							}`}
						>
							<p className="text-xs font-semibold text-indigo-500">{number}</p>
							<h2 className="mt-3 text-sm font-semibold">{title}</h2>
							<p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>
						</article>
					))}
				</section>

				<section className="mt-14">
					<div className="mb-4 flex flex-wrap items-end justify-between gap-3">
						<div>
							<p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-500">
								Transparansi publik
							</p>
							<h2 className="mt-1 text-xl font-semibold">Laporan terbaru</h2>
						</div>
						<Link href="/reports" className="text-xs font-semibold text-indigo-500 hover:text-indigo-400">
							Lihat semua laporan →
						</Link>
					</div>
					{isLoading && (
						<p className="py-10 text-center text-sm text-slate-500">Memuat laporan publik...</p>
					)}
					{error && (
						<div role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-500">
							{error}
						</div>
					)}
					{!isLoading && !error && reports.length === 0 && (
						<div className={`rounded-xl border p-8 text-center text-sm text-slate-500 ${
							isLightTheme ? "border-slate-200 bg-white" : "border-white/[0.06] bg-[#101827]"
						}`}>
							Belum ada laporan yang dipublikasikan.
						</div>
					)}
					{reports.length > 0 && (
						<div className="grid gap-3 lg:grid-cols-3">
							{reports.map((report) => <ReportCard key={report.id} report={report} />)}
						</div>
					)}
				</section>
				<footer className="mt-16 border-t border-white/[0.06] pt-5 text-xs text-slate-500">
					Sistem Pelaporan Masyarakat · Informasi publik tidak mencakup laporan privat.
				</footer>
			</main>
		</div>
	);
}
