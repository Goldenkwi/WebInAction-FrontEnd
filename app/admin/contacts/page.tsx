"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import RequireUser from "@/components/RequireUser";
import PortalLayout from "@/components/PortalLayout";
import { useTheme } from "@/components/providers/AppProviders";
import Alert from "@/components/ui/Alert";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";
import PageHeading from "@/components/ui/PageHeading";
import Panel from "@/components/ui/Panel";
import { apiRequest, type Agency } from "@/lib/backend";

/** Normalisasi nomor telepon untuk tautan tel: (0 di awal menjadi +62). */
function telHref(phone: string): string {
	const digits = phone.replace(/[^0-9+]/g, "");
	if (digits.startsWith("+")) return `tel:${digits}`;
	if (digits.startsWith("0")) return `tel:+62${digits.slice(1)}`;
	return `tel:${digits}`;
}

export default function AgencyContactsPage() {
	const [agencies, setAgencies] = useState<Agency[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");
	const { isLightTheme } = useTheme();

	useEffect(() => {
		const controller = new AbortController();
		apiRequest<Agency[]>("agencies", { signal: controller.signal })
			.then((response) => {
				setAgencies(response.data);
				setError("");
			})
			.catch((cause: unknown) => {
				if (!controller.signal.aborted)
					setError(
						cause instanceof Error
							? cause.message
							: "Kontak instansi gagal dimuat.",
					);
			})
			.finally(() => {
				if (!controller.signal.aborted) setIsLoading(false);
			});
		return () => controller.abort();
	}, []);

	const visibleAgencies = useMemo(() => {
		const keyword = search.trim().toLowerCase();
		if (!keyword) return agencies;
		return agencies.filter((agency) =>
			[
				agency.name,
				agency.acronym ?? agency.code,
				agency.city,
				agency.contact_email ?? agency.email,
				agency.contact_phone ?? agency.phone,
			]
				.filter(Boolean)
				.some((field) => String(field).toLowerCase().includes(keyword)),
		);
	}, [agencies, search]);

	return (
		<RequireUser roles={["super_admin"]}>
			<PortalLayout title="Kontak instansi">
				<PageHeading
					eyebrow="Direktori koordinasi"
					title="Kontak admin instansi"
					description="Kontak admin setiap instansi untuk koordinasi verifikasi dan tindak lanjut laporan."
				/>
				<Panel className="p-0">
					<div className={`border-b p-4 ${
						isLightTheme ? "border-slate-100" : "border-white/[0.06]"
					}`}>
						<input
							type="search"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Cari nama, singkatan, kota, email, atau telepon instansi..."
							aria-label="Cari kontak instansi"
							className={`w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-indigo-400 sm:max-w-sm ${
								isLightTheme
									? "border-slate-200 bg-white"
									: "border-white/10 bg-slate-950/40"
							}`}
						/>
					</div>

					{error && <div className="p-4"><Alert message={error} /></div>}
					{isLoading ? (
						<LoadingState label="Memuat kontak instansi..." />
					) : error ? null : visibleAgencies.length === 0 && agencies.length > 0 ? (
						<EmptyState
							title="Tidak ada instansi yang cocok"
							description="Ubah kata kunci pencarian untuk melihat instansi lain."
						/>
					) : agencies.length === 0 ? (
						<EmptyState
							title="Belum ada instansi"
							description="Tambahkan instansi terlebih dahulu di menu Manajemen instansi."
						/>
					) : (
						<div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
							{visibleAgencies.map((agency) => {
								const phone = agency.contact_phone ?? agency.phone;
								const email = agency.contact_email ?? agency.email;
								return (
									<article
										key={agency.id}
										className={`flex flex-col rounded-xl border p-4 ${
											isLightTheme
												? "border-slate-200 bg-white shadow-sm shadow-slate-200/40"
												: "border-white/[0.06] bg-[#101827]"
										}`}
									>
										<div className="flex items-start gap-3">
											{agency.photo_url ? (
												<Image
													src={agency.photo_url}
													width={64}
													height={64}
													unoptimized
													alt={`Logo ${agency.name}`}
													className="h-10 w-10 shrink-0 rounded-lg border object-cover"
												/>
											) : (
												<span
													className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-base font-semibold text-indigo-500 ${
														isLightTheme ? "bg-slate-100" : "bg-white/[0.04]"
													}`}
												>
													{agency.name.charAt(0).toUpperCase()}
												</span>
											)}
											<div className="min-w-0">
												<p className="truncate text-xs font-semibold" title={agency.name}>
													{agency.name}
												</p>
												<div className="mt-1 flex flex-wrap items-center gap-1.5">
													{(agency.acronym ?? agency.code) && (
														<span className="rounded border border-indigo-500/20 bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-500">
															{agency.acronym ?? agency.code}
														</span>
													)}
													{agency.is_active === false && (
														<span className="rounded border border-rose-500/20 bg-rose-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-rose-500">
															Nonaktif
														</span>
													)}
												</div>
											</div>
										</div>

										{agency.description && (
											<p className="mt-3 line-clamp-2 text-[10px] leading-relaxed text-slate-500">
												{agency.description}
											</p>
										)}

										<dl className={`mt-3 space-y-1.5 border-t pt-3 text-[11px] ${
											isLightTheme ? "border-slate-100" : "border-white/[0.06]"
										}`}>
											{phone ? (
												<div className="flex items-center gap-2">
													<dt className="w-14 shrink-0 text-slate-500">Telepon</dt>
													<dd>
														<a
															href={telHref(phone)}
															className="font-medium text-indigo-500 hover:underline"
														>
															{phone}
														</a>
													</dd>
												</div>
											) : null}
											{email ? (
												<div className="flex items-center gap-2">
													<dt className="w-14 shrink-0 text-slate-500">Email</dt>
													<dd className="min-w-0">
														<a
															href={`mailto:${email}`}
															className="block truncate font-medium text-indigo-500 hover:underline"
															title={email}
														>
															{email}
														</a>
													</dd>
												</div>
											) : null}
											{[agency.address, agency.city].filter(Boolean).length > 0 && (
												<div className="flex items-start gap-2">
													<dt className="w-14 shrink-0 text-slate-500">Alamat</dt>
													<dd className="text-slate-500">
														{[agency.address, agency.city].filter(Boolean).join(", ")}
													</dd>
												</div>
											)}
										</dl>

										<p className={`mt-3 border-t pt-3 text-[10px] text-slate-500 ${
											isLightTheme ? "border-slate-100" : "border-white/[0.06]"
										}`}>
											{agency.users_count ?? 0} akun petugas ·{" "}
											{agency.reports_count ?? 0} laporan
										</p>
									</article>
								);
							})}
						</div>
					)}
				</Panel>
			</PortalLayout>
		</RequireUser>
	);
}
