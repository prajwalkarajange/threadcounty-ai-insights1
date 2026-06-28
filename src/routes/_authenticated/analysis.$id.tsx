import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Printer, ArrowLeft, AlertTriangle, CheckCircle2, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { getAnalysis } from "@/lib/analyze.functions";
import { CircularGauge } from "@/routes/index";

export const Route = createFileRoute("/_authenticated/analysis/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Analysis ${params.id.slice(0, 6)} — ThreadCounty` }],
  }),
  component: AnalysisPage,
});

type Defect = { name: string; severity: "low" | "medium" | "high"; description: string };

function AnalysisPage() {
  const { id } = Route.useParams();
  const fetchAnalysis = useServerFn(getAnalysis);
  const reportRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["analysis", id],
    queryFn: () => fetchAnalysis({ data: { id } }),
  });

  if (isLoading)
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-thread" />
        <p className="mt-3 text-sm text-muted-foreground font-mono uppercase tracking-widest">Loading analysis…</p>
      </div>
    );
  if (error || !data?.analysis)
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <p className="text-destructive">Could not load analysis.</p>
        <Button asChild variant="link" className="mt-4">
          <Link to="/history">Back to history</Link>
        </Button>
      </div>
    );

  const a = data.analysis as unknown as {
    fabric_type: string;
    confidence: number;
    texture: string;
    color_analysis: string;
    weave_pattern: string;
    defects: Defect[];
    quality_score: number;
    recommendations: string[];
    summary: string;
    created_at: string;
  };
  const imgUrl = data.signedUrl;

  function onShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      navigator.share({ title: `ThreadCounty: ${a.fabric_type}`, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  }

  function onPrint() {
    window.print();
  }

  function onDownload() {
    // Lightweight "PDF" — opens print dialog scoped to the report
    onPrint();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14" ref={reportRef}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between print:hidden">
        <Button asChild variant="ghost" size="sm">
          <Link to="/history">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Link>
        </Button>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" variant="outline" onClick={onShare}>
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button size="sm" variant="outline" onClick={onPrint} className="hidden sm:inline-flex">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button size="sm" onClick={onDownload} className="gradient-thread text-[color:var(--accent-foreground)] border-0">
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-thread">Analysis Report · #{id.slice(0, 8)}</p>
        <h1 className="mt-3 font-display text-4xl sm:text-6xl">{a.fabric_type}</h1>
        <p className="mt-3 text-sm text-muted-foreground font-mono">
          {new Date(a.created_at).toLocaleString()} · confidence {(Number(a.confidence) * 100).toFixed(1)}%
        </p>
      </motion.div>

      <div className="mt-8 grid lg:grid-cols-[1.1fr_1fr] gap-6">
        {/* Image */}
        <div className="rounded-3xl overflow-hidden border bg-card aspect-square relative">
          {imgUrl ? (
            <img src={imgUrl} alt={a.fabric_type} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-muted-foreground">No preview</div>
          )}
          <div className="absolute top-4 left-4 glass rounded-full px-3 py-1.5 text-xs font-mono">
            confidence · {(Number(a.confidence) * 100).toFixed(1)}%
          </div>
        </div>

        {/* Quality */}
        <div className="grid gap-6">
          <div className="rounded-3xl border bg-card p-8 ring-thread">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Quality Score</p>
            <div className="mt-4 flex items-center gap-6">
              <div className="text-thread">
                <CircularGauge value={Number(a.quality_score)} size={120} />
              </div>
              <div>
                <p className="font-display text-6xl gradient-text-thread">{Math.round(Number(a.quality_score))}</p>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">out of 100</p>
              </div>
            </div>
            <p className="mt-6 text-sm leading-relaxed">{a.summary}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Metric label="Weave" value={a.weave_pattern} />
            <Metric label="Texture" value={a.texture} />
            <Metric label="Color" value={a.color_analysis} className="col-span-2" />
          </div>
        </div>
      </div>

      {/* Defects */}
      <section className="mt-12">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl">Defects</h2>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            {a.defects?.length ?? 0} found
          </p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(a.defects ?? []).length === 0 ? (
            <div className="rounded-2xl border bg-card p-6 flex items-center gap-3 col-span-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <p className="text-sm">No defects detected.</p>
            </div>
          ) : (
            a.defects.map((d, i) => (
              <div key={i} className="rounded-2xl border bg-card p-5">
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    className={`h-4 w-4 ${
                      d.severity === "high"
                        ? "text-destructive"
                        : d.severity === "medium"
                          ? "text-warning"
                          : "text-muted-foreground"
                    }`}
                  />
                  <p className="font-medium">{d.name}</p>
                  <Badge variant="outline" className="ml-auto font-mono text-[10px] uppercase">
                    {d.severity}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{d.description}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Recommendations */}
      <section className="mt-12">
        <h2 className="font-display text-3xl">Recommendations</h2>
        <ol className="mt-4 space-y-3">
          {(a.recommendations ?? []).map((r, i) => (
            <li key={i} className="rounded-2xl border bg-card p-5 flex gap-4">
              <span className="font-mono text-xs text-thread mt-0.5">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-sm">{r}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-16 text-center print:hidden">
        <Button asChild className="gradient-thread text-[color:var(--accent-foreground)] border-0">
          <Link to="/upload">
            <Sparkles className="mr-2 h-4 w-4" /> Analyze another fabric
          </Link>
        </Button>
      </div>
    </div>
  );
}

function Metric({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`rounded-2xl border bg-card p-5 ${className}`}>
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm">{value}</p>
    </div>
  );
}
