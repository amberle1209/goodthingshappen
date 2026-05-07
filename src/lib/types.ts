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
