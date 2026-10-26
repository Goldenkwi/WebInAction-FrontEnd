import ReportListPage from "@/components/pages/ReportListPage";
import { Suspense } from "react";

export default function PublicReportsPage() {
	return (
		<Suspense fallback={<main className="min-h-screen bg-background" />}>
			<ReportListPage
				title="Laporan publik"
				description="Jelajahi laporan yang telah diverifikasi dan dibagikan secara publik."
				endpoint="reports/public"
			/>
		</Suspense>
	);
}
