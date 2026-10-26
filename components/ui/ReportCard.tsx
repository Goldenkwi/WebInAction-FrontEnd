"use client";

import Link from "next/link";
import type { Report } from "@/lib/backend";
import StatusBadge from "@/components/ui/StatusBadge";
import { useTheme } from "@/components/providers/AppProviders";

export default function ReportCard({ report }: { report: Report }) {
	const { isLightTheme } = useTheme();
	return (
		<Link
			href={`/reports/${report.id}`}
			className={`block rounded-xl border p-4 transition ${
				isLightTheme
					? "border-slate-200 bg-white hover:border-indigo-200 hover:shadow-sm"
					: "border-white/[0.06] bg-[#101827] hover:border-indigo-400/30"
			}`}
		>
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div className="min-w-0">
					<p className="text-[10px] font-medium text-indigo-500">
						{report.ticket_number}
					</p>
					<h3 className="mt-1 truncate text-sm font-semibold">{report.title}</h3>
				</div>
				<StatusBadge status={report.status} label={report.status_label} />
			</div>
			<div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
				<span>{report.category?.name ?? "Kategori belum ditentukan"}</span>
				<span aria-hidden="true">·</span>
				<span>{report.location_text}</span>
				<span aria-hidden="true">·</span>
				<span>{new Date(report.created_at).toLocaleDateString("id-ID")}</span>
				{report.priority && (
					<>
						<span aria-hidden="true">·</span>
						<StatusBadge status={report.priority} label={report.priority_label} kind="priority" />
					</>
				)}
			</div>
		</Link>
	);
}
