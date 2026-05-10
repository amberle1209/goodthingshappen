import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL ?? "";
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? "";

function createLimiter(): Ratelimit | null {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;

  const redis = new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN });

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    analytics: true,
    prefix: "bloom:rl",
  });
}

const limiter = createLimiter();

function getIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "anonymous";
}

export interface RateLimitResult {
  limited: boolean;
  response?: NextResponse;
}

export async function checkRateLimit(request: NextRequest): Promise<RateLimitResult> {
  if (!limiter) return { limited: false };

  const identifier = getIdentifier(request);
  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  if (success) return { limited: false };

  const response = NextResponse.json(
    { success: false, error: "Too many requests. Please try again later." },
    { status: 429 },
  );
  response.headers.set("X-RateLimit-Limit", String(limit));
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  response.headers.set("X-RateLimit-Reset", String(reset));
  response.headers.set("Retry-After", String(Math.ceil((reset - Date.now()) / 1000)));

  return { limited: true, response };
}
