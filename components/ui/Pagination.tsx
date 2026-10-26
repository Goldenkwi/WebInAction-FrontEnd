"use client";

import { useTheme } from "@/components/providers/AppProviders";
import type { PaginationMeta } from "@/lib/backend";

export default function Pagination({
	meta,
	onPageChange,
}: {
	meta: PaginationMeta;
	onPageChange: (page: number) => void;
}) {
	const { isLightTheme } = useTheme();
	return (
		<div
			className={`flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-xs ${
				isLightTheme ? "border-slate-100 text-slate-500" : "border-white/[0.06] text-slate-400"
			}`}
		>
			<p>
				Halaman {meta.current_page} dari {Math.max(1, meta.last_page)} · {meta.total} laporan
			</p>
			<div className="flex gap-2">
				<button
					type="button"
					disabled={meta.current_page <= 1}
					onClick={() => onPageChange(meta.current_page - 1)}
					className={`rounded-md border px-3 py-1.5 disabled:opacity-40 ${
						isLightTheme ? "border-slate-200 hover:bg-slate-50" : "border-white/10 hover:bg-white/5"
					}`}
				>
					Sebelumnya
				</button>
				<button
					type="button"
					disabled={meta.current_page >= meta.last_page}
					onClick={() => onPageChange(meta.current_page + 1)}
					className={`rounded-md border px-3 py-1.5 disabled:opacity-40 ${
						isLightTheme ? "border-slate-200 hover:bg-slate-50" : "border-white/10 hover:bg-white/5"
					}`}
				>
					Berikutnya
				</button>
			</div>
		</div>
	);
}
