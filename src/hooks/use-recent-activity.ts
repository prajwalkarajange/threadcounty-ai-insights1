import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useRecentActivity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data, error } = await supabase
      .from("analysis_results")
      .select("id,fabric_type,quality_score,created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error) {
      setActivities(data ?? []);
    }

    setLoading(false);
  }

  return {
    activities,
    loading,
  };
}