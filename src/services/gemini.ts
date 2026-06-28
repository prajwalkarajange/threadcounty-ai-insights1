import { GoogleGenAI } from "@google/genai";

export type AnalysisPayload = {
  fabric_type: string;
  confidence: number;
  texture: string;
  color_analysis: string;
  weave_pattern: string;
  defects: {
    name: string;
    severity: "low" | "medium" | "high";
    description: string;
  }[];
  quality_score: number;
  recommendations: string[];
  summary: string;
};

const SYSTEM_PROMPT = `
You are an expert Textile Engineer.

Analyze the uploaded fabric image.

Return ONLY valid JSON.

{
  "fabric_type": "",
  "confidence": 0,
  "texture": "",
  "color_analysis": "",
  "weave_pattern": "",
  "defects": [],
  "quality_score": 0,
  "recommendations": [],
  "summary": ""
}
`;

export async function analyzeFabricImage(
  imageUrl: string,
  mimeType: string
): Promise<AnalysisPayload> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const ai = new GoogleGenAI({
    apiKey,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: SYSTEM_PROMPT,
          },
          {
            fileData: {
              fileUri: imageUrl,
              mimeType,
            },
          },
        ],
      },
    ],
  });

const text = response.text;

if (!text) {
  throw new Error("Gemini returned an empty response.");
}

// Remove markdown code fences if Gemini includes them
const cleanJson = text
  .replace(/```json\s*/gi, "")
  .replace(/```/g, "")
  .trim();

try {
  return JSON.parse(cleanJson) as AnalysisPayload;
} catch (err) {
  console.error("Gemini response:");
  console.error(text);
  throw new Error("Gemini returned invalid JSON.");
}
}