import PublicReportDetail from "@/components/pages/PublicReportDetail";
import RequireUser from "@/components/RequireUser";
import { Suspense } from "react";

export default function ReportDetailRoute({
	params,
}: PageProps<"/reports/[id]">) {
	return (
		<Suspense fallback={<main className="min-h-screen bg-background" />}>
			{params.then(({ id }) => (
				<RequireUser>
					<PublicReportDetail id={id} />
				</RequireUser>
			))}
		</Suspense>
	);
}
