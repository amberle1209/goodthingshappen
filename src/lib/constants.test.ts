import { describe, it, expect } from "vitest";
import {
  TONE_PALETTES,
  MOODS,
  PROMPTS,
  ENCOURAGEMENTS,
  LOAD_LINES,
  getToday,
  entryColor,
} from "./constants";

/* ─── TONE_PALETTES ─────────────────────────────────── */

describe("TONE_PALETTES", () => {
  it("has exactly 3 tones: ghibli, washi, dawn", () => {
    expect(Object.keys(TONE_PALETTES)).toEqual(["ghibli", "washi", "dawn"]);
  });

  it("each palette has 4 hex colors [accent, leaf, sky, sun]", () => {
    for (const [name, palette] of Object.entries(TONE_PALETTES)) {
      expect(palette, `${name} should have 4 entries`).toHaveLength(4);
      for (const color of palette) {
        expect(color, `${name} color should be a hex string`).toMatch(
          /^#[0-9a-fA-F]{6}$/,
        );
      }
    }
  });
});

/* ─── MOODS ─────────────────────────────────────────── */

describe("MOODS", () => {
  it("has exactly 6 moods for 3×2 grid", () => {
    expect(MOODS).toHaveLength(6);
  });

  it("each mood has id, label, symbol, and tint", () => {
    for (const mood of MOODS) {
      expect(mood.id).toBeTruthy();
      expect(mood.label).toBeTruthy();
      expect(mood.symbol).toBeTruthy();
      expect(mood.tint).toBeGreaterThanOrEqual(0);
      expect(mood.tint).toBeLessThanOrEqual(3);
    }
  });

  it("has unique ids", () => {
    const ids = MOODS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

/* ─── PROMPTS ───────────────────────────────────────── */

describe("PROMPTS", () => {
  it("has 3 groups (one per entry screen)", () => {
    expect(PROMPTS).toHaveLength(3);
  });

  it("each group has 5 prompts", () => {
    for (const group of PROMPTS) {
      expect(group).toHaveLength(5);
    }
  });

  it("all prompts are non-empty strings", () => {
    for (const group of PROMPTS) {
      for (const prompt of group) {
        expect(prompt.length).toBeGreaterThan(0);
      }
    }
  });
});

/* ─── ENCOURAGEMENTS / LOAD_LINES ───────────────────── */

describe("ENCOURAGEMENTS", () => {
  it("has at least 5 entries for variety", () => {
    expect(ENCOURAGEMENTS.length).toBeGreaterThanOrEqual(5);
  });
});

describe("LOAD_LINES", () => {
  it("has at least 3 lines for loading sequence", () => {
    expect(LOAD_LINES.length).toBeGreaterThanOrEqual(3);
  });
});

/* ─── entryColor ────────────────────────────────────── */

describe("entryColor", () => {
  const palette = TONE_PALETTES.ghibli;

  it("index 0 → palette[0] (accent)", () => {
    expect(entryColor(palette, 0)).toBe(palette[0]);
  });

  it("index 1 → palette[1] (leaf)", () => {
    expect(entryColor(palette, 1)).toBe(palette[1]);
  });

  it("index 2 → palette[3] (sun), skipping sky for contrast", () => {
    expect(entryColor(palette, 2)).toBe(palette[3]);
  });

  it("works with all 3 tone palettes", () => {
    for (const [, p] of Object.entries(TONE_PALETTES)) {
      expect(entryColor(p, 0)).toBe(p[0]);
      expect(entryColor(p, 1)).toBe(p[1]);
      expect(entryColor(p, 2)).toBe(p[3]);
    }
  });
});

/* ─── getToday ──────────────────────────────────────── */

describe("getToday", () => {
  it("returns an object with weekday, day, month, year", () => {
    const today = getToday();
    expect(today).toHaveProperty("weekday");
    expect(today).toHaveProperty("day");
    expect(today).toHaveProperty("month");
    expect(today).toHaveProperty("year");
  });

  it("weekday is a 3-letter abbreviation", () => {
    const { weekday } = getToday();
    expect(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]).toContain(
      weekday,
    );
  });

  it("month is a 3-letter abbreviation", () => {
    const { month } = getToday();
    expect([
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ]).toContain(month);
  });

  it("day is 1-31", () => {
    const { day } = getToday();
    expect(day).toBeGreaterThanOrEqual(1);
    expect(day).toBeLessThanOrEqual(31);
  });

  it("year is a 4-digit number", () => {
    const { year } = getToday();
    expect(year).toBeGreaterThanOrEqual(2024);
    expect(year).toBeLessThanOrEqual(2099);
  });
});
