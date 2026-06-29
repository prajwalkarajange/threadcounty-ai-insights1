import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAnalysis() {
  const [analysis, setAnalysis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalysis();
  }, []);

  async function loadAnalysis() {
    setLoading(true);

    const { data, error } = await supabase
      .from("analysis_results")
      .select("*")
      .order("created_at", { ascending: false });

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
    refresh: loadAnalysis,
  };
}