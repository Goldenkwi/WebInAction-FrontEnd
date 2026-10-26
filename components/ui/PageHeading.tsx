"use client";

import type { ReactNode } from "react";
import { useTheme } from "@/components/providers/AppProviders";

export default function PageHeading({
	eyebrow,
	title,
	description,
	actions,
}: {
	eyebrow?: string;
	title: string;
	description?: string;
	actions?: ReactNode;
}) {
	const { isLightTheme } = useTheme();
	return (
		<div className="flex flex-wrap items-end justify-between gap-4">
			<div className="max-w-3xl">
				{eyebrow && (
					<p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-500">
						{eyebrow}
					</p>
				)}
				<h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
					{title}
				</h2>
				{description && (
					<p
						className={`mt-1 text-xs leading-relaxed sm:text-sm ${
							isLightTheme ? "text-slate-500" : "text-slate-400"
						}`}
					>
						{description}
					</p>
				)}
			</div>
			{actions}
		</div>
	);
}
