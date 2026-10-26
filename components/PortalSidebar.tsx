"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useTheme } from "@/components/providers/AppProviders";

const citizenLinks = [
	{ href: "/my-reports", label: "Ringkasan saya" },
	{ href: "/reports/new", label: "Buat laporan" },
	{ href: "/reports", label: "Laporan publik" },
];

const verifierLinks = [
	{ href: "/admin", label: "Ringkasan" },
	{ href: "/admin/reports", label: "Verifikasi laporan" },
	{ href: "/admin/categories", label: "Kategori laporan" },
	{ href: "/reports", label: "Laporan publik" },
];

const agencyLinks = [
	{ href: "/admin", label: "Ringkasan" },
	{ href: "/admin/reports", label: "Tindak lanjut" },
	{ href: "/reports", label: "Laporan publik" },
];

export default function PortalSidebar({
	isOpen,
	onNavigate,
}: {
	isOpen: boolean;
	onNavigate: () => void;
}) {
	const pathname = usePathname();
	const { user } = useAuth();
	const { isLightTheme } = useTheme();
	const links = user?.role === "verifier_admin"
		? verifierLinks
		: user?.role === "agency_admin"
			? agencyLinks
			: citizenLinks;

	return (
		<>
			{isOpen && (
				<button
					type="button"
					aria-label="Tutup navigasi"
					onClick={onNavigate}
					className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden"
				/>
			)}
			<aside
				className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r px-4 py-5 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				} ${
					isLightTheme
						? "border-slate-200 bg-white text-slate-700"
						: "border-white/[0.06] bg-[#0b1120] text-slate-300"
				}`}
			>
				<Link href="/" onClick={onNavigate} className="mb-9 flex items-center gap-3 px-2">
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
						<span className="block text-sm font-bold tracking-wide">ADUAN PUBLIK</span>
						<span
							className={`block text-[10px] font-medium uppercase tracking-[0.16em] ${
								isLightTheme ? "text-slate-400" : "text-slate-500"
							}`}
						>
							Disposisi berbasis AI
						</span>
					</span>
				</Link>

				<p
					className={`mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] ${
						isLightTheme ? "text-slate-400" : "text-slate-600"
					}`}
				>
					Menu utama
				</p>
				<nav aria-label="Navigasi utama" className="space-y-1">
					{links.map((item) => {
						const active =
							pathname === item.href ||
							(item.href !== "/" && pathname.startsWith(`${item.href}/`));
						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={onNavigate}
								aria-current={active ? "page" : undefined}
								className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition ${
									active
										? "bg-indigo-500/10 text-indigo-500"
										: isLightTheme
											? "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
											: "text-slate-400 hover:bg-white/5 hover:text-slate-100"
								}`}
							>
								<span
									className={`h-1.5 w-1.5 rounded-full ${
										active ? "bg-indigo-500" : "bg-slate-500/50"
									}`}
								/>
								{item.label}
							</Link>
						);
					})}
				</nav>

				<div className="mt-auto">
					<div
						className={`rounded-xl border p-3 ${
							isLightTheme
								? "border-slate-200 bg-slate-50"
								: "border-white/[0.06] bg-white/[0.02]"
						}`}
					>
						<p
							className={`text-[10px] font-semibold uppercase tracking-wider ${
								isLightTheme ? "text-slate-500" : "text-slate-400"
							}`}
						>
							{user?.role_label ?? "Portal warga"}
						</p>
						<p
							className={`mt-1 text-[10px] ${
								isLightTheme ? "text-slate-400" : "text-slate-500"
							}`}
						>
							Sistem Pelaporan Masyarakat
						</p>
					</div>
					<p
						className={`mt-4 px-2 text-[10px] ${
							isLightTheme ? "text-slate-400" : "text-slate-600"
						}`}
					>
						Informasi diproses dengan aman
					</p>
				</div>
			</aside>
		</>
	);
}
