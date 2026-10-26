import React from "react";

export default function Header({
	title = "Dashboard",
	adminName = "Admin",
	onMenuClick,
}) {
	const initial = adminName.trim().charAt(0).toUpperCase() || "A";

	return (
		<header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
			<div className="flex min-w-0 items-center gap-3">
				<button
					type="button"
					onClick={onMenuClick}
					aria-label="Buka menu"
					className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
				>
					<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
						<path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
				<div className="min-w-0">
					<p className="text-xs text-slate-500">Admin</p>
					<h1 className="truncate text-lg font-semibold text-slate-900">{title}</h1>
				</div>
			</div>

			<div className="flex items-center gap-3 sm:gap-5">
				<label className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
					<svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
						<circle cx="11" cy="11" r="7" />
						<path strokeLinecap="round" d="m20 20-4-4" />
					</svg>
					<input
						type="search"
						aria-label="Cari"
						placeholder="Cari..."
						className="w-36 bg-transparent text-sm outline-none placeholder:text-slate-400"
					/>
				</label>

				<button
					type="button"
					aria-label="Notifikasi"
					className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
				>
					<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
						<path strokeLinecap="round" strokeLinejoin="round" d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4" />
					</svg>
					<span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
				</button>

				<div className="h-8 border-l border-slate-200" />
				<button type="button" className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100">
					<span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
						{initial}
					</span>
					<span className="hidden text-left sm:block">
						<span className="block text-sm font-medium text-slate-800">{adminName}</span>
						<span className="block text-xs text-slate-500">Administrator</span>
					</span>
					<svg className="hidden h-4 w-4 text-slate-400 sm:block" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path fillRule="evenodd" d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
					</svg>
				</button>
			</div>
		</header>
	);
}
