import type { FlowState, FlowAction } from "./types";

export const INITIAL_STATE: FlowState = { phase: "welcome" };

export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "BEGIN":
      if (state.phase === "welcome") return { phase: "input", step: 1 };
      return state;

    case "NEXT_INPUT":
      if (state.phase === "input" && state.step < 3) {
        return { phase: "input", step: (state.step + 1) as 1 | 2 | 3 };
      }
      if (state.phase === "input" && state.step === 3) {
        return { phase: "mood" };
      }
      return state;

    case "PREV_INPUT":
      if (state.phase === "input" && state.step > 1) {
        return { phase: "input", step: (state.step - 1) as 1 | 2 | 3 };
      }
      if (state.phase === "input" && state.step === 1) {
        return { phase: "welcome" };
      }
      return state;

    case "GO_MOOD":
      if (state.phase === "input" && state.step === 3) {
        return { phase: "mood" };
      }
      return state;

    case "BACK_TO_INPUT":
      if (state.phase === "mood") {
        return { phase: "input", step: 3 };
      }
      return state;

    case "BACK_TO_MOOD":
      if (state.phase === "reveal" || state.phase === "failed") {
        return { phase: "mood" };
      }
      return state;

    case "START_GENERATE":
      if (state.phase === "mood" || state.phase === "failed") {
        return {
          phase: "generating",
          entryId: action.entryId,
          predictionId: action.predictionId,
        };
      }
      return state;

    case "POLL":
      if (state.phase === "generating") {
        return {
          phase: "polling",
          entryId: action.entryId,
          predictionId: action.predictionId,
        };
      }
      return state;

    case "GENERATE_SUCCESS":
      if (
        state.phase === "generating" ||
        state.phase === "polling"
      ) {
        return {
          phase: "generated",
          entryId: action.entryId,
          imageUrl: action.imageUrl,
        };
      }
      return state;

    case "GENERATE_FAIL":
      if (
        state.phase === "generating" ||
        state.phase === "polling"
      ) {
        return {
          phase: "failed",
          error: action.error,
          entryId: action.entryId,
        };
      }
      return state;

    case "REVEAL":
      if (state.phase === "generated") {
        return {
          phase: "reveal",
          entryId: state.entryId,
          imageUrl: state.imageUrl,
        };
      }
      return state;

    case "GO_SHARE":
      if (state.phase === "reveal") {
        return {
          phase: "share",
          entryId: state.entryId,
          imageUrl: state.imageUrl,
        };
      }
      return state;

    case "BACK_TO_REVEAL":
      if (state.phase === "share") {
        return {
          phase: "reveal",
          entryId: state.entryId,
          imageUrl: state.imageUrl,
        };
      }
      return state;

    case "RESET":
      return INITIAL_STATE;

    default:
      return state;
  }
}
