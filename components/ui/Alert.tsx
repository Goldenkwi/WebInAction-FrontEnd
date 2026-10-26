"use client";

import { useTheme } from "@/components/providers/AppProviders";

export default function Alert({
	message,
	type = "error",
}: {
	message: string;
	type?: "error" | "success" | "info";
}) {
	const { isLightTheme } = useTheme();
	const variants = {
		error: "border-rose-500/20 bg-rose-500/10 text-rose-600",
		success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
		info: isLightTheme
			? "border-indigo-200 bg-indigo-50 text-indigo-700"
			: "border-indigo-400/20 bg-indigo-500/10 text-indigo-200",
	};

	return (
		<div
			role={type === "error" ? "alert" : "status"}
			className={`rounded-lg border px-3 py-2.5 text-sm ${variants[type]}`}
		>
			{message}
		</div>
	);
}
