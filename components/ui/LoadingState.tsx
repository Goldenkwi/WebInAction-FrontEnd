export default function LoadingState({ label = "Memuat data..." }: { label?: string }) {
	return (
		<div
			role="status"
			className="flex items-center justify-center gap-3 py-16 text-sm text-slate-500"
		>
			<span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
			{label}
		</div>
	);
}
