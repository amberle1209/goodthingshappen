import type { Palette, ToneName, MoodOption, DateInfo } from "./types";

export const TONE_PALETTES: Record<ToneName, Palette> = {
  ghibli: ["#c46a3a", "#6e8b5a", "#7aa3c6", "#e3b659"],
  washi: ["#b03a2e", "#7d6a36", "#a89466", "#d8a548"],
  dawn: ["#5b7c8a", "#889a7a", "#bfc8cf", "#d6c7a3"],
} as const;

export const MOODS: readonly MoodOption[] = [
  { id: "calm", label: "calm", symbol: "○", tint: 0 },
  { id: "tender", label: "tender", symbol: "◐", tint: 1 },
  { id: "bright", label: "bright", symbol: "☀", tint: 3 },
  { id: "wistful", label: "wistful", symbol: "◌", tint: 2 },
  { id: "grateful", label: "grateful", symbol: "♡", tint: 0 },
  { id: "tired", label: "tired", symbol: "◦", tint: 2 },
] as const;

export const PROMPTS: readonly string[][] = [
  [
    "the smallest thing",
    "a stranger's face",
    "a sound you noticed",
    "something warm",
    "a tiny win",
  ],
  [
    "who saw you today",
    "a passing moment",
    "something tasted",
    "a soft sentence",
    "a color outside",
  ],
  [
    "the slowest minute",
    "something that grew",
    "an old song",
    "a kept promise",
    "a tiny relief",
  ],
];

export const ENCOURAGEMENTS: readonly string[] = [
  "good. keep going.",
  "I see it.",
  "mm — that one.",
  "tender.",
  "okay, that's real.",
  "yes.",
];

export const LOAD_LINES: readonly string[] = [
  "reading what you wrote…",
  "mixing pigments…",
  "placing three markers…",
  "letting the colors bloom…",
];

/**
 * Map entry index (0, 1, 2) to palette color.
 * Entry 3 uses palette[3] (sun) instead of palette[2] (sky) to avoid
 * low-contrast sky color on markers/dots.
 */
export function entryColor(palette: Palette, index: number): string {
  return palette[index === 2 ? 3 : index];
}

export function getToday(): DateInfo {
  const d = new Date();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    weekday: days[d.getDay()],
    day: d.getDate(),
    month: months[d.getMonth()],
    year: d.getFullYear(),
  };
}
