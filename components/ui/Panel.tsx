"use client";

import type { ReactNode } from "react";
import { useTheme } from "@/components/providers/AppProviders";

export default function Panel({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) {
	const { isLightTheme } = useTheme();
	return (
		<section
			className={`rounded-xl border p-4 sm:p-5 ${
				isLightTheme
					? "border-slate-200 bg-white shadow-sm shadow-slate-200/40"
					: "border-white/[0.06] bg-[#101827]"
			} ${className}`}
		>
			{children}
		</section>
	);
}
