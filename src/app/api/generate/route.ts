import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { filterEntries } from "@/lib/contentFilter";

interface GenerateBody {
  entries: string[];
  mood: string;
}

function validateBody(body: unknown): body is GenerateBody {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  if (!Array.isArray(b.entries) || b.entries.length !== 3) return false;
  if (b.entries.some((e: unknown) => typeof e !== "string" || (e as string).trim().length === 0)) return false;
  if (typeof b.mood !== "string" || b.mood.trim().length === 0) return false;
  return true;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Rate limit check
  const { limited, response: limitResponse } = await checkRateLimit(request);
  if (limited && limitResponse) return limitResponse;

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  // Validate
  if (!validateBody(body)) {
    return NextResponse.json(
      { success: false, error: "Invalid request. Provide entries (3 non-empty strings) and mood." },
      { status: 400 },
    );
  }

  // Content filter
  const filterResult = filterEntries(body.entries);
  if (!filterResult.passed) {
    return NextResponse.json(
      { success: false, error: filterResult.reason },
      { status: 422 },
    );
  }

  // Generate scene (mock for now — real provider integration in Phase B merge)
  const id = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return NextResponse.json({
    success: true,
    data: { id, status: "processing" },
  });
}
