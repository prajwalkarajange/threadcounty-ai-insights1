import { createFileRoute } from "@tanstack/react-router";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <AnalyticsDashboard />
      <AnalyticsCharts />
      
    </div>
  );
}