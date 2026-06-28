import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const getHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("uploads")
      .select("*, analysis_results(id, fabric_type, confidence, quality_score, summary)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);

    // Sign URLs for previews
    const withUrls = await Promise.all(
      (data ?? []).map(async (u) => {
        const { data: s } = await supabase.storage
          .from("fabric-uploads")
          .createSignedUrl(u.storage_path, 60 * 60);
        return { ...u, signed_url: s?.signedUrl ?? null };
      }),
    );
    return withUrls;
  });

export const deleteUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: u } = await supabase.from("uploads").select("storage_path").eq("id", data.id).single();
    if (u?.storage_path) {
      await supabase.storage.from("fabric-uploads").remove([u.storage_path]);
    }
    await supabase.from("uploads").delete().eq("id", data.id);
    return { ok: true };
  });

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // Check admin role
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const isAdmin = (roles ?? []).some((r) => r.role === "admin");

    if (!isAdmin) {
      // Return user-scoped stats instead
      const { count: myUploads } = await supabase
        .from("uploads")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      const { count: myAnalyses } = await supabase
        .from("analysis_results")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      const { data: recent } = await supabase
        .from("analysis_results")
        .select("id, fabric_type, quality_score, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(8);
      const { data: scores } = await supabase
        .from("analysis_results")
        .select("quality_score")
        .eq("user_id", userId);
      const avg =
        (scores ?? []).reduce((s, r) => s + (Number(r.quality_score) || 0), 0) /
        Math.max(1, scores?.length ?? 1);
      return {
        isAdmin: false,
        totals: { uploads: myUploads ?? 0, analyses: myAnalyses ?? 0, avgQuality: Math.round(avg) },
        recent: recent ?? [],
      };
    }

    // Admin: load via service role
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ count: usersCount }, { count: uploadsCount }, { count: analysesCount }] = await Promise.all([
      supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("uploads").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("analysis_results").select("*", { count: "exact", head: true }),
    ]);
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const { count: todayCount } = await supabaseAdmin
      .from("uploads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", since);

    const { data: scores } = await supabaseAdmin.from("analysis_results").select("quality_score");
    const avg =
      (scores ?? []).reduce((s, r) => s + (Number(r.quality_score) || 0), 0) /
      Math.max(1, scores?.length ?? 1);

    const { data: recent } = await supabaseAdmin
      .from("analysis_results")
      .select("id, fabric_type, quality_score, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(10);

    return {
      isAdmin: true,
      totals: {
        users: usersCount ?? 0,
        uploads: uploadsCount ?? 0,
        analyses: analysesCount ?? 0,
        today: todayCount ?? 0,
        avgQuality: Math.round(avg),
      },
      recent: recent ?? [],
    };
  });
