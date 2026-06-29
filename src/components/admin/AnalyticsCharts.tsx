import { useAnalytics } from "@/hooks/use-analytics";

export default function AnalyticsCharts() {
  const stats = useAnalytics();

  if (stats.loading) {
    return <div>Loading analytics...</div>;
  }
  const max = Math.max(
    stats.users,
    stats.uploads,
    stats.analyses,
    stats.fabricTypes,
    stats.avgConfidence,
    stats.avgQuality,
    stats.totalDefects,
    1,
  );

  const bars = [
    {
      label: "Users",
      value: stats.users,
    },
    {
      label: "Uploads",
      value: stats.uploads,
    },
    {
      label: "AI Analysis",
      value: stats.analyses,
    },
    {
      label: "Fabric Types",
      value: stats.fabricTypes,
    },
    {
      label: "Avg Confidence",
      value: stats.avgConfidence,
    },
    {
      label: "Avg Quality",
      value: stats.avgQuality,
    },
    {
      label: "Defects",
      value: stats.totalDefects,
    },
  ];
  return (
    <div className="rounded-2xl border bg-card p-6">
      <h2 className="text-2xl font-bold mb-6">Platform Statistics</h2>

      <div className="space-y-6">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="flex justify-between text-sm mb-2">
              <span>{bar.label}</span>
              <span>
                {bar.label.includes("Confidence")
                  ? `${bar.value}%`
                  : bar.label.includes("Quality")
                    ? `${bar.value}/10`
                    : bar.value}
              </span>
            </div>

            <div className="h-4 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-500"
                style={{
                  width: `${(bar.value / max) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
