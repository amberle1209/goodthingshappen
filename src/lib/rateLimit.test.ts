import { describe, it, expect } from "vitest";
import { checkRateLimit } from "./rateLimit";

function mockRequest(ip?: string): any {
  const headers = new Map<string, string>();
  if (ip) headers.set("x-forwarded-for", ip);
  return {
    headers: {
      get: (key: string) => headers.get(key) ?? null,
    },
  };
}

describe("checkRateLimit", () => {
  it("passes through when no Upstash credentials configured", async () => {
    const result = await checkRateLimit(mockRequest("127.0.0.1"));
    expect(result.limited).toBe(false);
    expect(result.response).toBeUndefined();
  });
});
