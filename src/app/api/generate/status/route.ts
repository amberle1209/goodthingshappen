import { NextRequest, NextResponse } from "next/server";
import { getImageProvider } from "@/lib/scene/imageProvider";
import { checkRateLimit } from "@/lib/rateLimit";

/** Only allow alphanumeric, hyphens, underscores — max 64 chars */
const PREDICTION_ID_PATTERN = /^[a-zA-Z0-9_-]{1,64}$/;

export async function GET(request: NextRequest) {
  // Rate limit check (same sliding window as generate)
  const { limited, response: limitResponse } = await checkRateLimit(request);
  if (limited && limitResponse) return limitResponse;

  try {
    const predictionId = request.nextUrl.searchParams.get("id");
    if (!predictionId) {
      return NextResponse.json(
        { success: false, error: "Missing prediction id" },
        { status: 400 },
      );
    }

    if (!PREDICTION_ID_PATTERN.test(predictionId)) {
      return NextResponse.json(
        { success: false, error: "Invalid prediction id format" },
        { status: 400 },
      );
    }

    const imageProvider = getImageProvider();
    const result = await imageProvider.checkStatus(predictionId);

    if (result.status === "succeeded" && result.imageUrl) {
      // Update Supabase if configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const { supabase } = await import("@/lib/supabase");
        await supabase
          .from("entries")
          .update({
            status: "complete",
            image_url: result.imageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("prediction_id", predictionId);
      }

      return NextResponse.json({
        success: true,
        data: { status: "complete", imageUrl: result.imageUrl },
      });
    }

    if (result.status === "failed" || result.status === "canceled") {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const { supabase } = await import("@/lib/supabase");
        await supabase
          .from("entries")
          .update({
            status: "failed",
            error_message: result.error ?? "Generation failed",
            updated_at: new Date().toISOString(),
          })
          .eq("prediction_id", predictionId);
      }

      return NextResponse.json({
        success: true,
        data: { status: "failed", error: result.error ?? "Generation failed" },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        status: result.status === "starting" ? "pending" : "processing",
      },
    });
  } catch (err: unknown) {
    console.error("[api/generate/status]", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
