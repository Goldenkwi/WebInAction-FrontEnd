"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AppProviders";
import type { UserRole } from "@/lib/backend";

export default function RequireUser({
	children,
	roles,
	allowGuest = false,
}: {
	children: ReactNode;
	roles?: UserRole[];
	/** Bila true, pengunjung tanpa akun tetap diizinkan lewat (roles tetap berlaku bagi yang masuk). */
	allowGuest?: boolean;
}) {
	const { user, isLoading } = useAuth();
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		if (isLoading) return;
		if (!user) {
			if (allowGuest) return;
			router.replace(`/login?next=${encodeURIComponent(pathname)}`);
			return;
		}
		if (roles && !roles.includes(user.role)) {
			router.replace(user.role === "citizen" ? "/my-reports" : "/admin");
		}
	}, [allowGuest, isLoading, pathname, roles, router, user]);

	if (isLoading || !user || (roles && !roles.includes(user.role))) {
		if (!isLoading && !user && allowGuest) {
			return children;
		}
		return (
			<div className="flex min-h-screen items-center justify-center bg-background text-sm text-slate-400">
				<span className="flex items-center gap-3">
					<span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
					Memeriksa sesi...
				</span>
			</div>
		);
	}

	return children;
}
