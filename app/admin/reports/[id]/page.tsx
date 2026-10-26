import AdminReportDetail from "@/components/pages/AdminReportDetail";
import { Suspense } from "react";

export default function AdminReportDetailRoute({
	params,
}: PageProps<"/admin/reports/[id]">) {
	return (
		<Suspense fallback={<main className="min-h-screen bg-background" />}>
			{params.then(({ id }) => (
				<AdminReportDetail id={id} />
			))}
		</Suspense>
	);
}
