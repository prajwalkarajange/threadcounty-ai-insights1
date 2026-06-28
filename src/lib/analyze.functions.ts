import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const AnalyzeInput = z.object({ uploadId: z.string().uuid() });

export type AnalysisPayload = {
  fabric_type: string;
  confidence: number;
  texture: string;
  color_analysis: string;
  weave_pattern: string;
  defects: { name: string; severity: "low" | "medium" | "high"; description: string }[];
  quality_score: number;
  recommendations: string[];
  summary: string;
};

const SYSTEM_PROMPT = `You are ThreadCounty, an expert textile-engineering AI for fabric quality control.
You receive a single macro photograph of a fabric sample and respond with a strict JSON object only — no prose, no markdown fences.

The JSON MUST match this TypeScript type exactly:
{
  fabric_type: string,             // e.g. "Cotton Denim", "Silk Charmeuse", "Wool Tweed"
  confidence: number,              // 0..1
  texture: string,                 // 1 short sentence describing tactile character
  color_analysis: string,          // dominant + secondary colors and any color variation
  weave_pattern: string,           // e.g. "Plain weave", "Twill 2/1", "Satin", "Herringbone"
  defects: { name: string, severity: "low"|"medium"|"high", description: string }[],
  quality_score: number,           // 0..100, holistic quality
  recommendations: string[],       // 2-4 actionable manufacturing recommendations
  summary: string                  // 2-3 sentences, professional tone, no greetings
}

If the image is not a fabric, set fabric_type to "Unknown / Not a Fabric", confidence 0, quality_score 0, defects [], recommendations to a single string asking for a clearer fabric photograph, and summary explaining.

Return JSON only.`;

export const analyzeUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => AnalyzeInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // 1. Fetch upload row (RLS scopes to the user)
    const { data: upload, error: upErr } = await supabase
      .from("uploads")
      .select("*")
      .eq("id", data.uploadId)
      .single();
    if (upErr || !upload) throw new Error("Upload not found");

    // 2. Signed URL the AI can fetch
    const { data: signed, error: signErr } = await supabase.storage
      .from("fabric-uploads")
      .createSignedUrl(upload.storage_path, 60 * 10);
    if (signErr || !signed?.signedUrl) throw new Error("Could not sign image URL");

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI gateway not configured");

    // 3. Call Lovable AI Gateway directly (chat completions with vision)
    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this fabric sample and return JSON only." },
              { type: "image_url", image_url: { url: signed.signedUrl } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiRes.ok) {
      const body = await aiRes.text();
      if (aiRes.status === 429) throw new Error("AI rate limit reached. Please retry shortly.");
      if (aiRes.status === 402) throw new Error("AI credits exhausted. Please add credits in workspace settings.");
      throw new Error(`AI error ${aiRes.status}: ${body.slice(0, 200)}`);
    }

    const json = await aiRes.json();
    const raw = json?.choices?.[0]?.message?.content;
    if (!raw) throw new Error("Empty AI response");

    let parsed: AnalysisPayload;
    try {
      parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch {
      throw new Error("Could not parse AI response as JSON");
    }

    // 4. Persist
    const { data: inserted, error: insErr } = await supabase
      .from("analysis_results")
      .insert({
        upload_id: upload.id,
        user_id: userId,
        fabric_type: parsed.fabric_type,
        confidence: parsed.confidence,
        texture: parsed.texture,
        color_analysis: parsed.color_analysis,
        weave_pattern: parsed.weave_pattern,
        defects: parsed.defects ?? [],
        quality_score: parsed.quality_score,
        recommendations: parsed.recommendations ?? [],
        summary: parsed.summary,
        raw: json,
      })
      .select()
      .single();
    if (insErr) throw new Error(insErr.message);

    await supabase.from("uploads").update({ status: "analyzed" }).eq("id", upload.id);

    return { analysisId: inserted.id };
  });

export const getAnalysis = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: analysis, error } = await supabase
      .from("analysis_results")
      .select("*, uploads(*)")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);

    // Sign the image URL fresh for display
    const upload = (analysis as { uploads: { storage_path: string } | null }).uploads;
    let signedUrl: string | null = null;
    if (upload?.storage_path) {
      const { data: signed } = await supabase.storage
        .from("fabric-uploads")
        .createSignedUrl(upload.storage_path, 60 * 60);
      signedUrl = signed?.signedUrl ?? null;
    }
    return { analysis, signedUrl };
  });
