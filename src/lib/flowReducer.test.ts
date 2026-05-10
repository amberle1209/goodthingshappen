import { describe, it, expect } from "vitest";
import { flowReducer, INITIAL_STATE } from "./flowReducer";
import type { FlowState } from "./types";

describe("flowReducer", () => {
  it("starts in welcome phase", () => {
    expect(INITIAL_STATE).toEqual({ phase: "welcome" });
  });

  describe("BEGIN", () => {
    it("transitions welcome → input step 1", () => {
      const next = flowReducer(INITIAL_STATE, { type: "BEGIN" });
      expect(next).toEqual({ phase: "input", step: 1 });
    });

    it("no-ops from non-welcome phase", () => {
      const state: FlowState = { phase: "mood" };
      expect(flowReducer(state, { type: "BEGIN" })).toBe(state);
    });
  });

  describe("NEXT_INPUT", () => {
    it("advances step 1 → 2", () => {
      const state: FlowState = { phase: "input", step: 1 };
      expect(flowReducer(state, { type: "NEXT_INPUT" })).toEqual({ phase: "input", step: 2 });
    });

    it("advances step 2 → 3", () => {
      const state: FlowState = { phase: "input", step: 2 };
      expect(flowReducer(state, { type: "NEXT_INPUT" })).toEqual({ phase: "input", step: 3 });
    });

    it("transitions step 3 → mood", () => {
      const state: FlowState = { phase: "input", step: 3 };
      expect(flowReducer(state, { type: "NEXT_INPUT" })).toEqual({ phase: "mood" });
    });
  });

  describe("PREV_INPUT", () => {
    it("goes step 2 → 1", () => {
      const state: FlowState = { phase: "input", step: 2 };
      expect(flowReducer(state, { type: "PREV_INPUT" })).toEqual({ phase: "input", step: 1 });
    });

    it("goes step 1 → welcome", () => {
      const state: FlowState = { phase: "input", step: 1 };
      expect(flowReducer(state, { type: "PREV_INPUT" })).toEqual({ phase: "welcome" });
    });
  });

  describe("BACK_TO_INPUT", () => {
    it("mood → input step 3", () => {
      const state: FlowState = { phase: "mood" };
      expect(flowReducer(state, { type: "BACK_TO_INPUT" })).toEqual({ phase: "input", step: 3 });
    });
  });

  describe("generation flow", () => {
    it("START_GENERATE from mood → generating", () => {
      const state: FlowState = { phase: "mood" };
      const next = flowReducer(state, { type: "START_GENERATE", entryId: "e1", predictionId: "p1" });
      expect(next).toEqual({ phase: "generating", entryId: "e1", predictionId: "p1" });
    });

    it("POLL from generating → polling", () => {
      const state: FlowState = { phase: "generating", entryId: "e1", predictionId: "p1" };
      const next = flowReducer(state, { type: "POLL", entryId: "e1", predictionId: "p1" });
      expect(next).toEqual({ phase: "polling", entryId: "e1", predictionId: "p1" });
    });

    it("GENERATE_SUCCESS from polling → generated", () => {
      const state: FlowState = { phase: "polling", entryId: "e1", predictionId: "p1" };
      const next = flowReducer(state, { type: "GENERATE_SUCCESS", entryId: "e1", imageUrl: "http://img.png" });
      expect(next).toEqual({ phase: "generated", entryId: "e1", imageUrl: "http://img.png" });
    });

    it("GENERATE_FAIL from polling → failed", () => {
      const state: FlowState = { phase: "polling", entryId: "e1", predictionId: "p1" };
      const next = flowReducer(state, { type: "GENERATE_FAIL", error: "timeout", entryId: "e1" });
      expect(next).toEqual({ phase: "failed", error: "timeout", entryId: "e1" });
    });

    it("START_GENERATE from failed (retry) → generating", () => {
      const state: FlowState = { phase: "failed", error: "oops", entryId: "e1" };
      const next = flowReducer(state, { type: "START_GENERATE", entryId: "e2", predictionId: "p2" });
      expect(next).toEqual({ phase: "generating", entryId: "e2", predictionId: "p2" });
    });
  });

  describe("reveal + share flow", () => {
    it("REVEAL from generated → reveal", () => {
      const state: FlowState = { phase: "generated", entryId: "e1", imageUrl: "http://img.png" };
      const next = flowReducer(state, { type: "REVEAL" });
      expect(next).toEqual({ phase: "reveal", entryId: "e1", imageUrl: "http://img.png" });
    });

    it("GO_SHARE from reveal → share", () => {
      const state: FlowState = { phase: "reveal", entryId: "e1", imageUrl: "http://img.png" };
      const next = flowReducer(state, { type: "GO_SHARE" });
      expect(next).toEqual({ phase: "share", entryId: "e1", imageUrl: "http://img.png" });
    });

    it("BACK_TO_REVEAL from share → reveal", () => {
      const state: FlowState = { phase: "share", entryId: "e1", imageUrl: "http://img.png" };
      const next = flowReducer(state, { type: "BACK_TO_REVEAL" });
      expect(next).toEqual({ phase: "reveal", entryId: "e1", imageUrl: "http://img.png" });
    });

    it("BACK_TO_MOOD from reveal → mood", () => {
      const state: FlowState = { phase: "reveal", entryId: "e1", imageUrl: "http://img.png" };
      const next = flowReducer(state, { type: "BACK_TO_MOOD" });
      expect(next).toEqual({ phase: "mood" });
    });
  });

  describe("RESET", () => {
    it("returns to INITIAL_STATE from any phase", () => {
      const state: FlowState = { phase: "share", entryId: "e1", imageUrl: "http://img.png" };
      expect(flowReducer(state, { type: "RESET" })).toEqual(INITIAL_STATE);
    });
  });
});
