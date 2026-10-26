import ReportListPage from "@/components/pages/ReportListPage";
import { Suspense } from "react";

export default function MyReportsPage() {
	return (
		<Suspense fallback={<main className="min-h-screen bg-background" />}>
			<ReportListPage
				title="Laporan saya"
				description="Pantau status, hasil verifikasi, dan tindak lanjut laporan yang Anda kirim."
				endpoint="reports/my"
				requireCitizen
			/>
		</Suspense>
	);
}
