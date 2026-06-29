import { useLatestAnalysis } from "@/hooks/use-latest-analysis";

export default function LatestAnalysis() {
  const { analysis, loading } = useLatestAnalysis();

  if (loading) {
    return <div className="rounded-2xl border bg-card p-6">Loading latest analysis...</div>;
  }

  return (
    <div className="rounded-2xl border bg-card p-6">
      <h2 className="text-xl font-bold mb-6">Latest AI Analysis</h2>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left pb-3">Fabric</th>

            <th className="text-left pb-3">Quality</th>

            <th className="text-left pb-3">Confidence</th>

            <th className="text-left pb-3">Date</th>
          </tr>
        </thead>

        <tbody>
          {analysis.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-4">{item.fabric_type}</td>

              <td>
                {Number(item.quality_score) > 10
                  ? (Number(item.quality_score) / 10).toFixed(1)
                  : Number(item.quality_score).toFixed(1)}
                /10
              </td>

              <td>{item.confidence}%</td>

              <td>{new Date(item.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
