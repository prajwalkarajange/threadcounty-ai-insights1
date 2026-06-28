import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Users, Upload as UploadIcon, BarChart3, ImageIcon, Sparkles, Loader2 } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useServerFn } from "@tanstack/react-start";
import { getAdminStats } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — ThreadCounty" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const fetchStats = useServerFn(getAdminStats);
  const { data, isLoading } = useQuery({ queryKey: ["admin-stats"], queryFn: () => fetchStats() });

  if (isLoading || !data)
    return (
      <div className="grid place-items-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-thread" />
      </div>
    );

  const isAdmin = data.isAdmin;
  const t = data.totals as Record<string, number>;

  const cards = isAdmin
    ? [
        { label: "Total users", value: t.users ?? 0, icon: Users },
        { label: "Total uploads", value: t.uploads ?? 0, icon: UploadIcon },
        { label: "Analyses", value: t.analyses ?? 0, icon: BarChart3 },
        { label: "Uploads today", value: t.today ?? 0, icon: ImageIcon },
      ]
    : [
        { label: "Your uploads", value: t.uploads ?? 0, icon: UploadIcon },
        { label: "Your analyses", value: t.analyses ?? 0, icon: BarChart3 },
        { label: "Avg quality", value: t.avgQuality ?? 0, icon: Sparkles },
      ];

  const chartData =
    (data.recent ?? []).map((r) => ({
      name: r.fabric_type?.slice(0, 14) ?? "—",
      score: Math.round(Number(r.quality_score) || 0),
    })) ?? [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-widest text-thread">
            {isAdmin ? "Admin · System overview" : "Your overview"}
          </p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isAdmin ? "Live metrics across the platform." : "Your activity at a glance."}
          </p>
        </div>
        {isAdmin && <Badge className="gradient-thread text-[color:var(--accent-foreground)] border-0 shrink-0">Admin</Badge>}
      </div>

      <div className={`mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-${cards.length}`}>
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{c.label}</p>
              <c.icon className="h-4 w-4 text-thread" />
            </div>
            <p className="mt-3 font-display text-4xl">{c.value.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Recent quality scores</h2>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">last 10</p>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }} domain={[0, 100]} />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="score" fill="var(--thread)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <h2 className="font-display text-2xl">Recent activity</h2>
          <ul className="mt-4 divide-y">
            {(data.recent ?? []).slice(0, 8).map((r) => (
              <li key={r.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{r.fabric_type ?? "—"}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {new Date(r.created_at).toLocaleString()}
                  </p>
                </div>
                <Badge variant="secondary" className="font-mono text-xs shrink-0">
                  {Math.round(Number(r.quality_score) || 0)}
                </Badge>
              </li>
            ))}
            {(data.recent ?? []).length === 0 && (
              <li className="py-8 text-center text-sm text-muted-foreground">No activity yet.</li>
            )}
          </ul>
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link to="/history">View all history</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
