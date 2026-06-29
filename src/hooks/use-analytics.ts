import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAnalytics() {
  const [stats, setStats] = useState({
    users: 0,
    uploads: 0,
    analyses: 0,
    avgQuality: 0,
    avgConfidence: 0,
    fabricTypes: 0,
    totalDefects: 0,
    loading: true,
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [
      { count: users },
      { count: uploads },
      { data: analysis },
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("uploads")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("analysis_results")
        .select("*"),
    ]);

    let quality = 0;
    let confidence = 0;
    let defects = 0;

    const fabrics = new Set<string>();

    analysis?.forEach((item) => {
      quality += Number(item.quality_score ?? 0);
      confidence += Number(item.confidence ?? 0);

      if (item.fabric_type) {
        fabrics.add(item.fabric_type);
      }

      if (Array.isArray(item.defects)) {
        defects += item.defects.length;
      }
    });

    setStats({
      users: users ?? 0,
      uploads: uploads ?? 0,
      analyses: analysis?.length ?? 0,
      avgQuality:
        analysis?.length
          ? Number((quality / analysis.length).toFixed(1))
          : 0,
      avgConfidence:
        analysis?.length
          ? Math.round(confidence / analysis.length)
          : 0,
      fabricTypes: fabrics.size,
      totalDefects: defects,
      loading: false,
    });
  }

  return stats;
}