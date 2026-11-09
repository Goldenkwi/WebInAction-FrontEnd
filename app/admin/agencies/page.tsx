"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import RequireUser from "@/components/RequireUser";
import PortalLayout from "@/components/PortalLayout";
import AgencyForm from "@/components/admin/AgencyForm";
import {
	useAuth,
	useTheme,
} from "@/components/providers/AppProviders";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";
import PageHeading from "@/components/ui/PageHeading";
import Panel from "@/components/ui/Panel";
import { apiRequest, type Agency } from "@/lib/backend";
import { toast } from "react-toastify";

type SortKey = "name" | "city" | "reports" | "created_at";
type SortDirection = "asc" | "desc";
type SortState = { key: SortKey; direction: SortDirection };

const SORT_LABELS: Record<SortKey, string> = {
	name: "Nama instansi",
	city: "Kota",
	reports: "Jumlah laporan",
	created_at: "Terdaftar",
};

export default function AdminAgenciesPage() {
	const [agencies, setAgencies] = useState<Agency[]>([]);
	const [editableAgency, setEditableAgency] = useState<Agency | null>(null);
	const [search, setSearch] = useState("");
	const [cityFilter, setCityFilter] = useState("all");
	const [sort, setSort] = useState<SortState>({ key: "name", direction: "asc" });
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState("");
	const [deletingId, setDeletingId] = useState<number | null>(null);
	const { isLightTheme } = useTheme();
	const { user } = useAuth();

	const loadAgencies = useCallback(async () => {
		try {
			const response = await apiRequest<Agency[]>("agencies");
			setAgencies(response.data);
			setLoadError("");
		} catch (cause) {
			setLoadError(
				cause instanceof Error ? cause.message : "Data instansi gagal dimuat.",
			);
			toast.error("Data instansi gagal dimuat.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadAgencies();
	}, [loadAgencies]);

	function toggleSort(key: SortKey) {
		setSort((current) =>
			current.key === key
				? { key, direction: current.direction === "asc" ? "desc" : "asc" }
				: { key, direction: "asc" },
		);
	}

	const uniqueCities = useMemo(
		() =>
			[
				...new Set(
					agencies
						.map((agency) => agency.city?.trim())
						.filter((city): city is string => Boolean(city)),
				),
			].sort((left, right) => left.localeCompare(right, "id")),
		[agencies],
	);

	const visibleAgencies = useMemo(() => {
		const term = search.trim().toLowerCase();
		const filtered = agencies.filter((agency) => {
			const matchesTerm =
				term === "" ||
				[
					agency.name,
					agency.code,
					agency.city,
					agency.email,
					agency.address,
				].some((field) => field?.toLowerCase().includes(term));
			const matchesCity =
				cityFilter === "all" || agency.city === cityFilter;
			return matchesTerm && matchesCity;
		});

		const direction = sort.direction === "asc" ? 1 : -1;
		const compareText = (left: string, right: string) =>
			left > right ? 1 : left < right ? -1 : 0;
		return filtered.sort((left, right) => {
			switch (sort.key) {
				case "reports":
					return (
						((left.reports_count ?? 0) - (right.reports_count ?? 0)) * direction
					);
				case "created_at": {
					const leftTime = Date.parse(left.created_at ?? "") || 0;
					const rightTime = Date.parse(right.created_at ?? "") || 0;
					if (leftTime < rightTime) return -direction;
					if (leftTime > rightTime) return direction;
					return 0;
				}
				case "city":
					return compareText(left.city ?? "", right.city ?? "") * direction;
				default:
					return compareText(left.name, right.name) * direction;
			}
		});
	}, [agencies, search, cityFilter, sort]);

	async function handleDelete(agency: Agency) {
		const confirmed = window.confirm(
			`Hapus instansi "${agency.name}"? Instansi yang memiliki laporan terkait biasanya akan ditolak oleh server.`,
		);
		if (!confirmed) return;
		setDeletingId(agency.id);
		try {
			const response = await apiRequest<null>(`agencies/${agency.id}`, {
				method: "DELETE",
			});
			toast.success(response.message || "Instansi berhasil dihapus.");
			if (editableAgency?.id === agency.id) setEditableAgency(null);
			await loadAgencies();
		} catch (cause) {
			toast.error(
				cause instanceof Error
					? cause.message
					: "Instansi gagal dihapus. Silakan coba lagi.",
			);
		} finally {
			setDeletingId(null);
		}
	}

	const filterFieldClass = `w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-indigo-400 ${
		isLightTheme ? "border-slate-200 bg-white" : "border-white/10 bg-slate-950/40"
	}`;

	const sortIndicator = (key: SortKey) =>
		sort.key !== key
			? "↕"
			: sort.direction === "asc"
				? "▲"
				: "▼";

	return (
		<RequireUser roles={["super_admin"]}>
			<PortalLayout title="Manajemen instansi">
				<PageHeading
					eyebrow="Pengaturan sistem"
					title="Manajemen instansi"
					description="Kelola data instansi penerima laporan. Hanya super admin yang dapat mengelola data ini."
				/>

				{loadError && (
					<div className="mb-4">
						<p className="text-sm text-rose-500">{loadError}</p>
						<button
							type="button"
							onClick={() => void loadAgencies()}
							className="mt-2 rounded-md border border-indigo-500/20 px-3 py-1.5 text-xs font-semibold text-indigo-500 hover:bg-indigo-500/10"
						>
							Coba muat ulang
						</button>
					</div>
				)}

				<div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
					<Panel className="p-0">
						<div
							className={`border-b px-4 py-3 ${
								isLightTheme ? "border-slate-100" : "border-white/[0.06]"
							}`}
						>
							<div className="flex flex-wrap items-center justify-between gap-2">
								<h2 className="text-xs font-semibold">Daftar instansi</h2>
								<p className="text-[10px] text-slate-500">
									{agencies.length} instansi terdaftar
								</p>
							</div>
							<div className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_160px]">
								<input
									value={search}
									onChange={(event) => setSearch(event.target.value)}
									placeholder="Cari nama, kode, kota, atau email instansi..."
									className={filterFieldClass}
									aria-label="Cari instansi"
								/>
								<select
									value={cityFilter}
									onChange={(event) => setCityFilter(event.target.value)}
									className={filterFieldClass}
									aria-label="Filter kota"
								>
									<option value="all">Semua kota</option>
									{uniqueCities.map((city) => (
										<option key={city} value={city}>
											{city}
										</option>
									))}
								</select>
							</div>
							<div className="mt-2 flex flex-wrap gap-1.5">
								{(
									Object.keys(SORT_LABELS) as SortKey[]
								).map((key) => (
									<button
										key={key}
										type="button"
										onClick={() => toggleSort(key)}
										className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition ${
											sort.key === key
												? "border-indigo-500/40 bg-indigo-500/10 text-indigo-500"
												: isLightTheme
													? "border-slate-200 text-slate-500 hover:bg-slate-100"
													: "border-white/10 text-slate-400 hover:bg-white/5"
										}`}
									>
										{SORT_LABELS[key]} {sortIndicator(key)}
									</button>
								))}
							</div>
						</div>

						{isLoading ? (
							<LoadingState label="Memuat data instansi..." />
						) : visibleAgencies.length === 0 && agencies.length > 0 ? (
							<EmptyState
								title="Tidak ada instansi yang cocok"
								description="Ubah kata kunci pencarian atau filter kota."
							/>
						) : agencies.length === 0 ? (
							<EmptyState
								title="Belum ada instansi"
								description="Tambahkan instansi melalui formulir di samping."
							/>
						) : (
							<ul
								className={`divide-y ${
									isLightTheme ? "divide-slate-100" : "divide-white/[0.05]"
								}`}
							>
								{visibleAgencies.map((agency) => (
									<li
										key={agency.id}
										className="flex items-center justify-between gap-3 px-4 py-3"
									>
										<div className="flex min-w-0 items-center gap-3">
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
													className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base font-semibold text-indigo-500 ${
														isLightTheme ? "bg-slate-100" : "bg-white/[0.04]"
													}`}
												>
													{agency.name.charAt(0).toUpperCase()}
												</span>
											)}
											<div className="min-w-0">
												<p className="truncate text-xs font-semibold">
													{agency.name}
													{agency.code ? (
														<span className="ml-2 text-[10px] font-medium text-slate-500">
															{agency.code}
														</span>
													) : null}
												</p>
												<p className="mt-1 truncate text-[10px] text-slate-500">
													{[agency.city, agency.email].filter(Boolean).join(" · ") ||
														"—"}
													{" · "}
													{agency.reports_count ?? 0} laporan
												</p>
											</div>
										</div>
										<div className="flex shrink-0 gap-2">
											<button
												type="button"
												onClick={() => setEditableAgency(agency)}
												className="rounded-md border border-indigo-500/20 px-2.5 py-1.5 text-[10px] font-semibold text-indigo-500 hover:bg-indigo-500/10"
											>
												Ubah
											</button>
											<button
												type="button"
												onClick={() => void handleDelete(agency)}
												disabled={deletingId === agency.id}
												className="rounded-md border border-rose-500/20 px-2.5 py-1.5 text-[10px] font-semibold text-rose-500 hover:bg-rose-500/10 disabled:opacity-50"
											>
												{deletingId === agency.id ? "Menghapus..." : "Hapus"}
											</button>
										</div>
									</li>
								))}
							</ul>
						)}
					</Panel>

					<Panel>
						<h2 className="text-sm font-semibold">
							{editableAgency ? "Ubah instansi" : "Tambah instansi"}
						</h2>
						<p className="mt-1 text-[10px] leading-relaxed text-slate-500">
							{editableAgency
								? `Mengubah data instansi #${editableAgency.id}.`
								: user?.role_label
									? `Sebagai ${user.role_label}, Anda dapat menambah data instansi.`
									: "Instansi akan menerima tindak lanjut laporan."}
						</p>
						<AgencyForm
							key={editableAgency?.id ?? "new"}
							agency={editableAgency}
							onSaved={async () => {
								setEditableAgency(null);
								await loadAgencies();
							}}
							onCancel={() => setEditableAgency(null)}
						/>
					</Panel>
				</div>
			</PortalLayout>
		</RequireUser>
	);
}
