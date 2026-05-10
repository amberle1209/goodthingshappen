import { describe, it, expect, vi, beforeEach } from "vitest";
import { MockProvider } from "./imageProvider";

describe("MockProvider", () => {
  let provider: MockProvider;

  beforeEach(() => {
    provider = new MockProvider();
  });

  it("startGeneration returns a prediction ID prefixed with mock-", async () => {
    const result = await provider.startGeneration("a beautiful meadow");
    expect(result.predictionId).toMatch(/^mock-/);
  });

  it("checkStatus returns processing before resolve time", async () => {
    const { predictionId } = await provider.startGeneration("test scene");
    const status = await provider.checkStatus(predictionId);
    expect(status.status).toBe("processing");
    expect(status.imageUrl).toBeUndefined();
  });

  it("checkStatus returns succeeded with imageUrl after resolve time", async () => {
    vi.useFakeTimers();
    const { predictionId } = await provider.startGeneration("test scene");

    // Fast-forward past the 3s delay
    vi.advanceTimersByTime(3100);

    const status = await provider.checkStatus(predictionId);
    expect(status.status).toBe("succeeded");
    expect(status.imageUrl).toBeTruthy();
    expect(status.imageUrl).toContain("placehold.co");

    vi.useRealTimers();
  });

  it("checkStatus returns failed for unknown prediction ID", async () => {
    const status = await provider.checkStatus("unknown-id");
    expect(status.status).toBe("failed");
    expect(status.error).toContain("Unknown");
  });

  it("generates unique prediction IDs", async () => {
    const r1 = await provider.startGeneration("scene 1");
    const r2 = await provider.startGeneration("scene 2");
    expect(r1.predictionId).not.toBe(r2.predictionId);
  });
});
