import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useLatestAnalysis() {
  const [analysis, setAnalysis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    const { data, error } = await supabase
      .from("analysis_results")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error(error);
    } else {
      setAnalysis(data ?? []);
    }

    setLoading(false);
  }

  return {
    analysis,
    loading,
  };
}