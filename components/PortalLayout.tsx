"use client";

import { useState, type ReactNode } from "react";
import Header from "@/components/Header";
import PortalSidebar from "@/components/PortalSidebar";
import { useTheme } from "@/components/providers/AppProviders";

export default function PortalLayout({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const { isLightTheme } = useTheme();

	return (
		<div
			className={`min-h-screen transition-colors ${
				isLightTheme
					? "bg-slate-50 text-slate-900"
					: "bg-[#080d18] text-slate-100"
			}`}
		>
			<div className="flex min-h-screen">
				<PortalSidebar
					isOpen={isSidebarOpen}
					onNavigate={() => setIsSidebarOpen(false)}
				/>
				<div className="min-w-0 flex-1">
					<Header
						title={title}
						onMenuClick={() => setIsSidebarOpen((open) => !open)}
						showMenuButton
					/>
					<main className="mx-auto w-full max-w-[1600px] space-y-6 p-4 sm:p-6 xl:p-8">
						{children}
					</main>
				</div>
			</div>
		</div>
	);
}
