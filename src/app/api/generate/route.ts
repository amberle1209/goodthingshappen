import { NextRequest, NextResponse } from "next/server";
import type { ToneName } from "@/lib/types";
import {
  buildUserPrompt,
  getSystemPrompt,
  PROMPT_VERSION,
} from "@/lib/scene/promptTemplate";
import { generateMockScenePrompt } from "@/lib/scene/mockPrompt";
import { getImageProvider } from "@/lib/scene/imageProvider";

const MAX_ENTRY_LENGTH = 500;
const MAX_ENTRIES = 3;

function sanitizeEntry(entry: string): string {
  return entry.trim().slice(0, MAX_ENTRY_LENGTH);
}

function validateInput(body: unknown):
  | { entries: string[]; mood: string; tone: ToneName }
  | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid request body" };
  }

  const { entries, mood, tone } = body as Record<string, unknown>;

  if (!Array.isArray(entries) || entries.length !== MAX_ENTRIES) {
    return { error: `Exactly ${MAX_ENTRIES} entries required` };
  }

  const sanitized = entries.map((e) => {
    if (typeof e !== "string") return "";
    return sanitizeEntry(e);
  });

  if (sanitized.some((e) => e.length < 1)) {
    return { error: "All entries must be non-empty" };
  }

  if (typeof mood !== "string" || mood.length === 0) {
    return { error: "Mood is required" };
  }

  const validTone = (tone as string) || "ghibli";
  if (!["ghibli", "washi", "dawn"].includes(validTone)) {
    return { error: "Invalid tone" };
  }

  return {
    entries: sanitized,
    mood: mood as string,
    tone: validTone as ToneName,
  };
}

async function generateScenePrompt(
  entries: string[],
  mood: string,
  tone: ToneName,
): Promise<string> {
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!openaiKey) {
    // Mock mode: return a pre-written scene prompt
    return generateMockScenePrompt({ entries, mood, tone });
  }

  // Dynamic import to avoid errors when openai package isn't configured
  const { default: OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey: openaiKey });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: getSystemPrompt() },
      { role: "user", content: buildUserPrompt({ entries, mood, tone }) },
    ],
    max_tokens: 300,
    temperature: 0.85,
  });

  const scenePrompt = completion.choices[0]?.message?.content?.trim();
  if (!scenePrompt) {
    throw new Error("Empty response from GPT");
  }

  return scenePrompt;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = validateInput(body);

    if ("error" in validated) {
      return NextResponse.json(
        { success: false, error: validated.error },
        { status: 400 },
      );
    }

    const { entries, mood, tone } = validated;

    const scenePrompt = await generateScenePrompt(entries, mood, tone);

    const imageProvider = getImageProvider();
    const { predictionId } = await imageProvider.startGeneration(scenePrompt);

    // If Supabase is configured, persist to DB
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let entryId = `local-${Date.now()}`;

    if (supabaseUrl && supabaseKey) {
      const { supabase } = await import("@/lib/supabase");
      const { data: entry, error: dbError } = await supabase
        .from("entries")
        .insert({
          entries,
          mood,
          tone,
          scene_prompt: scenePrompt,
          prediction_id: predictionId,
          prompt_version: PROMPT_VERSION,
          status: "generating",
        })
        .select("id")
        .single();

      if (!dbError && entry) {
        entryId = entry.id;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        entryId,
        predictionId,
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
