"use client";

import { useCallback, useRef } from "react";
import type { MoodId, ToneName } from "./types";

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 60;

interface GenerateInput {
  entries: string[];
  mood: MoodId | string;
  tone: ToneName;
}

interface GenerateCallbacks {
  onStart: (entryId: string, predictionId: string) => void;
  onSuccess: (entryId: string, imageUrl: string) => void;
  onError: (error: string, entryId?: string) => void;
}

export function useGenerate() {
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(
    async (input: GenerateInput, callbacks: GenerateCallbacks) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
          signal: controller.signal,
        });

        const json = await res.json();
        if (!json.success || !json.data) {
          callbacks.onError(json.error ?? "Failed to start generation");
          return;
        }

        const { entryId, predictionId } = json.data as {
          entryId: string;
          predictionId: string;
        };
        callbacks.onStart(entryId, predictionId);

        let attempts = 0;
        while (attempts < MAX_POLL_ATTEMPTS) {
          if (controller.signal.aborted) return;

          await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
          attempts++;

          if (controller.signal.aborted) return;

          const pollRes = await fetch(
            `/api/generate/status?id=${encodeURIComponent(predictionId)}`,
            { signal: controller.signal },
          );
          const pollJson = await pollRes.json();

          if (!pollJson.success) {
            callbacks.onError(
              pollJson.error ?? "Polling failed",
              entryId,
            );
            return;
          }

          const { status, imageUrl, error } = pollJson.data as {
            status: string;
            imageUrl?: string;
            error?: string;
          };

          if (status === "complete" && imageUrl) {
            callbacks.onSuccess(entryId, imageUrl);
            return;
          }

          if (status === "failed") {
            callbacks.onError(error ?? "Generation failed", entryId);
            return;
          }
        }

        callbacks.onError("Generation timed out", entryId);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const message =
          err instanceof Error ? err.message : "Network error";
        callbacks.onError(message);
      }
    },
    [],
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { generate, cancel };
}
