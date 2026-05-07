"use client";

import { useCallback, useState } from "react";
import type { MoodId, ToneName } from "@/lib/types";
import { TONE_PALETTES, getToday } from "@/lib/constants";
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

  // 0 welcome → 1/2/3 good things → 4 mood → 5 tear+loading → 6 reveal → 7 share
  const [step, setStep] = useState(0);
  const [entries, setEntries] = useState(["", "", ""]);
  const [mood, setMood] = useState<MoodId | "">("");

  const setEntry = (i: number, v: string) =>
    setEntries((es) => es.map((e, j) => (j === i ? v : e)));

  const reset = () => {
    setEntries(["", "", ""]);
    setMood("");
    setStep(0);
  };

  const handleTearDone = useCallback(() => setStep(6), []);

  return (
    <div
      data-tone={tone}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: "var(--tone-bg)",
      }}
    >
      {step === 0 && (
        <WelcomeScreen onBegin={() => setStep(1)} date={today} />
      )}

      {step >= 1 && step <= 3 && (
        <GoodThingScreen
          key={step}
          index={step - 1}
          value={entries[step - 1]}
          onChange={(v) => setEntry(step - 1, v)}
          onNext={() => setStep(step + 1)}
          onBack={() => setStep(step - 1)}
          palette={palette}
          particleIntensity={particleIntensity}
        />
      )}

      {step === 4 && (
        <MoodScreen
          value={mood}
          onChange={setMood}
          onNext={() => setStep(5)}
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
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            zIndex: 99,
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(8px)",
            border: "1px solid var(--tone-rule)",
            borderRadius: 99,
            padding: "4px 10px",
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
