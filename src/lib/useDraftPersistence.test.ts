import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { loadDraft, clearDraft } from "./useDraftPersistence";

const STORAGE_KEY = "bloom_draft";

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const store = new Map<string, string>();
const mockStorage = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, value),
  removeItem: (key: string) => store.delete(key),
  clear: () => store.clear(),
  get length() { return store.size; },
  key: (_i: number) => null,
} as Storage;

beforeEach(() => {
  store.clear();
  Object.defineProperty(window, "localStorage", { value: mockStorage, writable: true, configurable: true });
});

describe("loadDraft", () => {
  it("returns null when nothing stored", () => {
    expect(loadDraft()).toBeNull();
  });

  it("returns draft for today", () => {
    const draft = {
      entries: ["a", "b", "c"],
      mood: "calm",
      step: 2,
      dateKey: todayKey(),
    };
    store.set(STORAGE_KEY, JSON.stringify(draft));
    expect(loadDraft()).toEqual({ entries: ["a", "b", "c"], mood: "calm", step: 2 });
  });

  it("returns null and clears storage for a different day", () => {
    const draft = {
      entries: ["a", "b", ""],
      mood: "",
      step: 1,
      dateKey: "2020-01-01",
    };
    store.set(STORAGE_KEY, JSON.stringify(draft));
    expect(loadDraft()).toBeNull();
    expect(store.has(STORAGE_KEY)).toBe(false);
  });

  it("returns null for step >= 5 (already submitted)", () => {
    const draft = {
      entries: ["a", "b", "c"],
      mood: "bright",
      step: 5,
      dateKey: todayKey(),
    };
    store.set(STORAGE_KEY, JSON.stringify(draft));
    expect(loadDraft()).toBeNull();
  });

  it("handles corrupt JSON gracefully", () => {
    store.set(STORAGE_KEY, "not-json{{{");
    expect(loadDraft()).toBeNull();
  });

  it("handles missing fields gracefully", () => {
    store.set(STORAGE_KEY, JSON.stringify({ entries: ["a"] }));
    expect(loadDraft()).toBeNull();
  });
});

describe("clearDraft", () => {
  it("removes the draft from localStorage", () => {
    store.set(STORAGE_KEY, "something");
    clearDraft();
    expect(store.has(STORAGE_KEY)).toBe(false);
  });
});
