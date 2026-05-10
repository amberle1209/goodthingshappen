"use client";

import { useEffect, useRef } from "react";
import type { MoodId } from "./types";

const STORAGE_KEY = "bloom_draft";

interface Draft {
  entries: string[];
  mood: MoodId | "";
  step: number;
  dateKey: string;
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function readDraft(): Draft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "entries" in parsed &&
      "mood" in parsed &&
      "step" in parsed &&
      "dateKey" in parsed
    ) {
      const d = parsed as Draft;
      if (d.dateKey !== todayKey()) {
        window.localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return d;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

interface DraftState {
  entries: string[];
  mood: MoodId | "";
  step: number;
}

export function loadDraft(): DraftState | null {
  const draft = readDraft();
  if (!draft) return null;
  if (draft.step >= 5) return null;
  return { entries: draft.entries, mood: draft.mood, step: draft.step };
}

export function useDraftPersistence(
  entries: string[],
  mood: MoodId | "",
  step: number,
): void {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    if (step >= 5) return;
    if (step === 0 && entries.every((e) => e === "") && mood === "") return;

    const draft: Draft = { entries, mood, step, dateKey: todayKey() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [entries, mood, step]);
}
