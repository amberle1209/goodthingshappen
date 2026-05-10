"use client";

import posthog from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

let initialized = false;

export function initAnalytics(): void {
  if (initialized) return;
  if (!POSTHOG_KEY) return;
  if (typeof window === "undefined") return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false,
    capture_pageleave: true,
    persistence: "localStorage",
    autocapture: false,
    disable_session_recording: true,
  });

  initialized = true;
}

export type BloomEvent =
  | { event: "flow_started" }
  | { event: "entry_completed"; index: number }
  | { event: "mood_selected"; mood: string }
  | { event: "generation_started" }
  | { event: "card_revealed" }
  | { event: "card_shared"; method: "native" | "twitter" | "download" }
  | { event: "draft_restored" }
  | { event: "flow_reset" };

export function track(payload: BloomEvent): void {
  if (!initialized) return;
  const { event, ...properties } = payload;
  posthog.capture(event, properties);
}
