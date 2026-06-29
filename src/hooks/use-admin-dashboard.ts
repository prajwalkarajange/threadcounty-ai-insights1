import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type DashboardStats = {
  users: number;
  uploads: number;
  analyses: number;
  avgQuality: number;
  loading: boolean;
};

export function useAdminDashboard(): DashboardStats {
  const [stats, setStats] = useState({
    users: 0,
    uploads: 0,
    analyses: 0,
    avgQuality: 0,
    loading: true,
  });

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          { count: users },
          { count: uploads },
          { data: analyses },
        ] = await Promise.all([
          supabase
            .from("profiles")
            .select("*", { count: "exact", head: true }),

          supabase
            .from("uploads")
            .select("*", { count: "exact", head: true }),

          supabase
            .from("analysis_results")
            .select("quality_score"),
        ]);

        let avgQuality = 0;

        if (analyses && analyses.length > 0) {
          avgQuality =
            analyses.reduce(
              (sum, item) => sum + (item.quality_score ?? 0),
              0
            ) / analyses.length;
        }

        setStats({
          users: users ?? 0,
          uploads: uploads ?? 0,
          analyses: analyses?.length ?? 0,
          avgQuality: Math.round(avgQuality),
          loading: false,
        });
      } catch (err) {
        console.error("Dashboard Error:", err);

        setStats((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    }

    loadDashboard();
  }, []);

  return stats;
}