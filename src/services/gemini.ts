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
You are an expert Textile Engineer and Fabric Quality Inspector.

Analyze the uploaded fabric image carefully.

Return ONLY a valid JSON object.

Do NOT return markdown.
Do NOT return explanation.
Do NOT wrap inside \`\`\`json.

The JSON format MUST be:

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

  let response;

  try {
    response = await ai.models.generateContent({
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
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    console.error("Gemini API Error:", message);

    if (
      message.includes("503") ||
      message.includes("UNAVAILABLE") ||
      message.includes("high demand")
    ) {
      throw new Error(
        "Gemini AI is currently busy. Please wait a few seconds and try again."
      );
    }

    if (message.includes("429")) {
      throw new Error(
        "Gemini API rate limit reached. Please try again later."
      );
    }

    if (message.includes("401") || message.includes("403")) {
      throw new Error(
        "Invalid Gemini API key. Please check your configuration."
      );
    }

    throw new Error("Failed to analyze image. Please try again.");
  }

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  const cleanJson = text
    .replace(/```json\s*/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleanJson) as AnalysisPayload;
  } catch {
    console.error("Gemini Raw Response:");
    console.error(text);

    throw new Error(
      "Gemini returned an unexpected response. Please try again."
    );
  }
}