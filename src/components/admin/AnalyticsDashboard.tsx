import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { useAnalytics } from "@/hooks/use-analytics";

const COLORS = [
  "#f97316",
  "#3b82f6",
  "#22c55e",
  "#ef4444",
  "#8b5cf6",
];

export default function AnalyticsDashboard() {
  const stats = useAnalytics();

  if (stats.loading) return null;

  const pieData = [
    {
      name: "Fabric Types",
      value: stats.fabricTypes,
    },
    {
      name: "Uploads",
      value: stats.uploads,
    },
    {
      name: "Users",
      value: stats.users,
    },
  ];

  const barData = [
    {
      name: "Confidence",
      value: stats.avgConfidence,
    },
    {
      name: "Quality",
      value: stats.avgQuality * 10,
    },
    {
      name: "Defects",
      value: stats.totalDefects,
    },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6 mt-8">

      <div className="rounded-2xl border bg-card p-6">
        <h2 className="font-bold text-xl mb-4">
          Fabric Distribution
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={110}
              label
            >
              {pieData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <h2 className="font-bold text-xl mb-4">
          AI Statistics
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="4 4" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#f97316"
              radius={[10,10,0,0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}