import type { ReportPriority, ReportStatus } from "@/lib/backend";

const statuses: Record<ReportStatus, string> = {
	pending: "border-amber-500/20 bg-amber-500/10 text-amber-600",
	verified: "border-indigo-500/20 bg-indigo-500/10 text-indigo-500",
	followed_up: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
	rejected: "border-rose-500/20 bg-rose-500/10 text-rose-600",
};

const priorities: Record<ReportPriority, string> = {
	rendah: "border-slate-500/20 bg-slate-500/10 text-slate-500",
	sedang: "border-sky-500/20 bg-sky-500/10 text-sky-600",
	tinggi: "border-orange-500/20 bg-orange-500/10 text-orange-600",
	darurat: "border-rose-500/20 bg-rose-500/10 text-rose-600",
};

export default function StatusBadge({
	status,
	label,
	kind = "status",
}: {
	status: ReportStatus | ReportPriority | null;
	label?: string | null;
	kind?: "status" | "priority";
}) {
	if (!status) {
		return (
			<span className="inline-flex rounded-full border border-slate-500/20 bg-slate-500/10 px-2 py-1 text-[10px] font-medium text-slate-500">
				Belum tersedia
			</span>
		);
	}
	const styles = kind === "status" ? statuses : priorities;
	const text =
		label ??
		(kind === "status"
			? {
					pending: "Menunggu",
					verified: "Terverifikasi",
					followed_up: "Ditindaklanjuti",
					rejected: "Ditolak",
				}[status as ReportStatus]
			: status.charAt(0).toUpperCase() + status.slice(1));

	return (
		<span
			className={`inline-flex whitespace-nowrap rounded-full border px-2 py-1 text-[10px] font-semibold ${styles[status as keyof typeof styles]}`}
		>
			{text}
		</span>
	);
}
