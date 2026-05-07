export type ToneName = "ghibli" | "washi" | "dawn";

/** [accent, leaf, sky, sun] */
export type Palette = readonly [string, string, string, string];

export interface DateInfo {
  weekday: string;
  day: number;
  month: string;
  year: number;
}

export type MoodId = "calm" | "tender" | "bright" | "wistful" | "grateful" | "tired";

export interface MoodOption {
  id: MoodId;
  label: string;
  symbol: string;
  /** Index into palette array for tint color */
  tint: number;
}

// ── BloomFlow state machine ──────────────────────────

export type FlowState =
  | { phase: "welcome" }
  | { phase: "input"; step: 1 | 2 | 3 }
  | { phase: "mood" }
  | { phase: "generating"; entryId: string; predictionId: string }
  | { phase: "polling"; entryId: string; predictionId: string }
  | { phase: "generated"; entryId: string; imageUrl: string }
  | { phase: "failed"; error: string; entryId?: string }
  | { phase: "reveal"; entryId: string; imageUrl: string }
  | { phase: "share"; entryId: string; imageUrl: string };

export type FlowAction =
  | { type: "BEGIN" }
  | { type: "NEXT_INPUT" }
  | { type: "PREV_INPUT" }
  | { type: "GO_MOOD" }
  | { type: "BACK_TO_INPUT" }
  | { type: "START_GENERATE"; entryId: string; predictionId: string }
  | { type: "POLL"; entryId: string; predictionId: string }
  | { type: "GENERATE_SUCCESS"; entryId: string; imageUrl: string }
  | { type: "GENERATE_FAIL"; error: string; entryId?: string }
  | { type: "REVEAL" }
  | { type: "GO_SHARE" }
  | { type: "BACK_TO_REVEAL" }
  | { type: "BACK_TO_MOOD" }
  | { type: "RESET" };
