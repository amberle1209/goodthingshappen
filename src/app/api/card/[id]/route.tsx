import { ImageResponse } from "@vercel/og";
import { NextRequest, NextResponse } from "next/server";
import { TONE_PALETTES, getToday } from "@/lib/constants";
import type { ToneName } from "@/lib/types";
import { CardLayout } from "@/lib/card/composer";

export const runtime = "edge";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Try loading from Supabase if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let entries = ["a warm cup of tea", "birdsong at dawn", "a friend's laugh"];
    let mood = "calm";
    let tone: ToneName = "ghibli";
    let imageUrl: string | undefined;

    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: entry } = await supabase
        .from("entries")
        .select("*")
        .eq("id", id)
        .single();

      if (!entry) {
        return NextResponse.json(
          { success: false, error: "Entry not found" },
          { status: 404 },
        );
      }

      entries = entry.entries;
      mood = entry.mood;
      tone = entry.tone as ToneName;
      imageUrl = entry.image_url ?? undefined;
    }

    const palette = TONE_PALETTES[tone] ?? TONE_PALETTES.ghibli;
    const today = getToday();

    return new ImageResponse(
      <CardLayout
        data={{
          entries,
          mood,
          date: today,
          palette,
          imageUrl,
        }}
      />,
      {
        width: 1080,
        height: 1920,
      },
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to generate card";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
