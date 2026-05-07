import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getImageProvider } from "@/lib/scene/imageProvider";

export async function GET(request: NextRequest) {
  try {
    const predictionId = request.nextUrl.searchParams.get("id");
    if (!predictionId) {
      return NextResponse.json(
        { success: false, error: "Missing prediction id" },
        { status: 400 },
      );
    }

    const imageProvider = getImageProvider();
    const result = await imageProvider.checkStatus(predictionId);

    if (result.status === "succeeded" && result.imageUrl) {
      const { error: updateError } = await supabase
        .from("entries")
        .update({
          status: "complete",
          image_url: result.imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("prediction_id", predictionId);

      if (updateError) {
        return NextResponse.json(
          { success: false, error: "Failed to update entry" },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          status: "complete",
          imageUrl: result.imageUrl,
        },
      });
    }

    if (result.status === "failed" || result.status === "canceled") {
      await supabase
        .from("entries")
        .update({
          status: "failed",
          error_message: result.error ?? "Generation failed",
          updated_at: new Date().toISOString(),
        })
        .eq("prediction_id", predictionId);

      return NextResponse.json({
        success: true,
        data: {
          status: "failed",
          error: result.error ?? "Generation failed",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        status: result.status === "starting" ? "pending" : "processing",
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
