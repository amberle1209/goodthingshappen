"use client";

import { useCallback, useState } from "react";
import type { MoodId, ToneName } from "@/lib/types";
import { TONE_PALETTES, getToday } from "@/lib/constants";
import { loadDraft, clearDraft, useDraftPersistence } from "@/lib/useDraftPersistence";
import { track } from "@/lib/analytics";
import { WelcomeScreen } from "./WelcomeScreen";
import { GoodThingScreen } from "./GoodThingScreen";
import { MoodScreen } from "./MoodScreen";
import { TearAwayLoading } from "./TearAwayLoading";
import { RevealScreen } from "./RevealScreen";
import { ShareScreen } from "./ShareScreen";

interface BloomFlowProps {
  tone?: ToneName;
  particleIntensity?: number;
}

export function BloomFlow({
  tone = "ghibli",
  particleIntensity = 1,
}: BloomFlowProps) {
  const palette = TONE_PALETTES[tone];
  const today = getToday();

  const [draft] = useState(loadDraft);
  const [step, setStep] = useState(() => {
    if (draft) track({ event: "draft_restored" });
    return draft?.step ?? 0;
  });
  const [entries, setEntries] = useState(draft?.entries ?? ["", "", ""]);
  const [mood, setMood] = useState<MoodId | "">(draft?.mood ?? "");
  useDraftPersistence(entries, mood, step);

  const setEntry = (i: number, v: string) =>
    setEntries((es) => es.map((e, j) => (j === i ? v : e)));

  const reset = () => {
    track({ event: "flow_reset" });
    clearDraft();
    setEntries(["", "", ""]);
    setMood("");
    setStep(0);
  };

  const handleTearDone = useCallback(() => { track({ event: "card_revealed" }); setStep(6); }, []);

  return (
    <div
      data-tone={tone}
      role="main"
      aria-live="polite"
      aria-atomic="false"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: "var(--tone-bg)",
      }}
    >
      {step === 0 && (
        <WelcomeScreen onBegin={() => { track({ event: "flow_started" }); setStep(1); }} date={today} />
      )}

      {step >= 1 && step <= 3 && (
        <GoodThingScreen
          key={step}
          index={step - 1}
          value={entries[step - 1]}
          onChange={(v) => setEntry(step - 1, v)}
          onNext={() => { track({ event: "entry_completed", index: step - 1 }); setStep(step + 1); }}
          onBack={() => setStep(step - 1)}
          palette={palette}
          particleIntensity={particleIntensity}
        />
      )}

      {step === 4 && (
        <MoodScreen
          value={mood}
          onChange={setMood}
          onNext={() => { track({ event: "mood_selected", mood: mood || "unknown" }); track({ event: "generation_started" }); setStep(5); }}
          onBack={() => setStep(3)}
          palette={palette}
        />
      )}

      {step === 5 && (
        <TearAwayLoading
          entries={entries}
          mood={mood}
          date={today}
          palette={palette}
          onDone={handleTearDone}
        />
      )}

      {step === 6 && (
        <RevealScreen
          entries={entries}
          mood={mood}
          date={today}
          palette={palette}
          onShare={() => setStep(7)}
          onBack={() => setStep(4)}
        />
      )}

      {step === 7 && (
        <ShareScreen
          onBack={() => setStep(6)}
          palette={palette}
          date={today}
        />
      )}

      {step >= 6 && (
        <button
          onClick={reset}
          aria-label="Start over"
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            zIndex: 99,
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(8px)",
            border: "1px solid var(--tone-rule)",
            borderRadius: 99,
            padding: "10px 14px",
            minHeight: 44,
            minWidth: 44,
            cursor: "pointer",
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "var(--tone-ink-soft)",
          }}
        >
          ↻ start over
        </button>
      )}
    </div>
  );
}
