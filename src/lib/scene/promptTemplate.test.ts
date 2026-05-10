import { describe, it, expect } from "vitest";
import { buildUserPrompt, getSystemPrompt, PROMPT_VERSION } from "./promptTemplate";

describe("promptTemplate", () => {
  describe("PROMPT_VERSION", () => {
    it("is a non-empty string", () => {
      expect(PROMPT_VERSION).toBe("v1");
    });
  });

  describe("getSystemPrompt", () => {
    it("returns a non-empty system prompt", () => {
      const prompt = getSystemPrompt();
      expect(prompt.length).toBeGreaterThan(100);
    });

    it("includes key constraints", () => {
      const prompt = getSystemPrompt();
      expect(prompt).toContain("landscape");
      expect(prompt).toContain("never");
      expect(prompt).toContain("120 words");
    });
  });

  describe("buildUserPrompt", () => {
    const input = {
      entries: ["warm coffee", "sunset walk", "a kind stranger"],
      mood: "grateful",
      tone: "ghibli" as const,
    };

    it("includes all entries numbered", () => {
      const prompt = buildUserPrompt(input);
      expect(prompt).toContain("1. warm coffee");
      expect(prompt).toContain("2. sunset walk");
      expect(prompt).toContain("3. a kind stranger");
    });

    it("includes mood", () => {
      const prompt = buildUserPrompt(input);
      expect(prompt).toContain("Mood: grateful");
    });

    it("includes tone-specific art style for ghibli", () => {
      const prompt = buildUserPrompt(input);
      expect(prompt).toContain("Ghibli");
      expect(prompt).toContain("watercolor");
    });

    it("uses washi style for washi tone", () => {
      const prompt = buildUserPrompt({ ...input, tone: "washi" });
      expect(prompt).toContain("washi");
      expect(prompt).toContain("ink wash");
    });

    it("uses dawn style for dawn tone", () => {
      const prompt = buildUserPrompt({ ...input, tone: "dawn" });
      expect(prompt).toContain("Scandinavian");
      expect(prompt).toContain("dawn");
    });
  });
});
