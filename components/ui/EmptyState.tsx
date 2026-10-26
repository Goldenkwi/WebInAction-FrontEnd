"use client";

import Link from "next/link";
import { useTheme } from "@/components/providers/AppProviders";

export default function EmptyState({
	title,
	description,
	actionHref,
	actionLabel,
}: {
	title: string;
	description: string;
	actionHref?: string;
	actionLabel?: string;
}) {
	const { isLightTheme } = useTheme();
	return (
		<div className="px-5 py-14 text-center">
			<div
				className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${
					isLightTheme ? "bg-slate-100 text-slate-400" : "bg-white/[0.04] text-slate-500"
				}`}
			>
				<svg
					className="h-6 w-6"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.6"
					aria-hidden="true"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
					<path strokeLinecap="round" d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 7h8m-8 4h6" />
				</svg>
			</div>
			<h3 className="mt-4 text-sm font-semibold">{title}</h3>
			<p className={`mx-auto mt-1 max-w-md text-xs leading-relaxed ${
				isLightTheme ? "text-slate-500" : "text-slate-400"
			}`}>
				{description}
			</p>
			{actionHref && actionLabel && (
				<Link
					href={actionHref}
					className="mt-4 inline-flex rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-600"
				>
					{actionLabel}
				</Link>
			)}
		</div>
	);
}
