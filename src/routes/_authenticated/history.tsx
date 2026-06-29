import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, LayoutGrid, Rows, ImageOff, Sparkles, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { getHistory, deleteUpload } from "@/lib/admin.functions";
import { CircularGauge } from "@/routes/index";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({ meta: [{ title: "Upload History — ThreadCounty" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const fetchHistory = useServerFn(getHistory);
  const delFn = useServerFn(deleteUpload);
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["history"],
    queryFn: () => fetchHistory(),
  });

  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["history"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [q, setQ] = useState("");
  const [view, setView] = useState<"grid" | "table">("grid");

  const items = useMemo(() => {
    const arr = data ?? [];
    if (!q) return arr;
    const lo = q.toLowerCase();
    return arr.filter((u) => {
      const a = (u.analysis_results ?? [])[0];
      return (
        u.original_name?.toLowerCase().includes(lo) ||
        a?.fabric_type?.toLowerCase().includes(lo) ||
        a?.summary?.toLowerCase().includes(lo)
      );
    });
  }, [data, q]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-widest text-thread">Library</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">Upload history</h1>
          <p className="mt-2 text-sm text-muted-foreground">Every fabric you've analyzed.</p>
        </div>
        <Button
          asChild
          className="gradient-thread text-[color:var(--accent-foreground)] border-0 shrink-0"
        >
          <Link to="/upload">
            <Sparkles className="mr-2 h-4 w-4" /> New analysis
          </Link>
        </Button>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search fabric type, filename, or summary…"
            className="pl-9 bg-surface-elevated"
          />
        </div>
        <div className="inline-flex rounded-lg border p-0.5">
          <button
            onClick={() => setView("grid")}
            className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 ${view === "grid" ? "bg-muted" : ""}`}
          >
            <LayoutGrid className="h-4 w-4" /> Cards
          </button>
          <button
            onClick={() => setView("table")}
            className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 ${view === "table" ? "bg-muted" : ""}`}
          >
            <Rows className="h-4 w-4" /> Table
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-2xl animate-shimmer" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState />
      ) : view === "grid" ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((u, i) => {
            const a = (u.analysis_results ?? [])[0];
            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => a && navigate({ to: "/analysis/$id", params: { id: a.id } })}
                className="group rounded-2xl border bg-card overflow-hidden cursor-pointer hover:border-thread/60 transition-colors"
              >
                <div className="relative aspect-[4/3] bg-muted">
                  {u.signed_url ? (
                    <img
                      src={u.signed_url}
                      alt={u.original_name ?? "fabric"}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center">
                      <ImageOff className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  {a?.quality_score != null && (
                    <div className="absolute top-3 right-3 glass rounded-full pl-2 pr-3 py-1 flex items-center gap-2">
                      <CircularGauge value={Number(a.quality_score)} size={28} />
                      <span className="font-mono text-xs">
                        {Math.round(Number(a.quality_score))}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{a?.fabric_type ?? "Pending"}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                        {new Date(u.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {a?.confidence != null && (
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        {Math.round(Number(a.confidence))}%
                      </Badge>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate max-w-[60%]">
                      {u.original_name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Delete this upload?")) del.mutate(u.id);
                      }}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Delete"
                    >
                      {del.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-widest font-mono text-muted-foreground">
              <tr>
                <th className="text-left p-3">Preview</th>
                <th className="text-left p-3">Fabric</th>
                <th className="text-left p-3 hidden sm:table-cell">Date</th>
                <th className="text-left p-3 hidden md:table-cell">Conf.</th>
                <th className="text-left p-3">Score</th>
                <th className="p-3 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((u) => {
                const a = (u.analysis_results ?? [])[0];
                return (
                  <tr key={u.id} className="hover:bg-muted/40">
                    <td className="p-2">
                      {u.signed_url ? (
                        <img
                          src={u.signed_url}
                          alt=""
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-md bg-muted grid place-items-center">
                          <ImageOff className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => a && navigate({ to: "/analysis/$id", params: { id: a.id } })}
                        className="font-medium hover:text-thread text-left"
                      >
                        {a?.fabric_type ?? "Pending"}
                      </button>
                      <p className="text-xs text-muted-foreground">{u.original_name}</p>
                    </td>
                    <td className="p-3 hidden sm:table-cell font-mono text-xs">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 hidden md:table-cell font-mono text-xs">
                      {a?.confidence != null ? `${Math.round(Number(a.confidence))}%` : "—"}
                    </td>
                    <td className="p-3 font-mono text-xs">
                      {a?.quality_score != null ? Math.round(Number(a.quality_score)) : "—"}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => confirm("Delete this upload?") && del.mutate(u.id)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-16 rounded-3xl border-2 border-dashed p-16 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl gradient-thread">
        <Sparkles className="h-6 w-6 text-[color:var(--accent-foreground)]" />
      </div>
      <h3 className="mt-6 font-display text-2xl">Nothing analyzed yet</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Upload your first fabric photo to get started.
      </p>
      <Button
        asChild
        className="mt-6 gradient-thread text-[color:var(--accent-foreground)] border-0"
      >
        <Link to="/upload">Upload fabric</Link>
      </Button>
    </div>
  );
}
