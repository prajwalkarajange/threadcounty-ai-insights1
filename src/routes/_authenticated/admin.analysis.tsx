import { createFileRoute } from "@tanstack/react-router";
import AnalysisTable from "@/components/admin/AnalysisTable";

export const Route = createFileRoute("/_authenticated/admin/analysis")({
  component: AnalysisPage,
});

function AnalysisPage() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          AI Analysis
        </h1>

        <p className="text-muted-foreground">
          Review AI-generated analysis results.
        </p>
      </div>

      <AnalysisTable />

    </div>
  );
}