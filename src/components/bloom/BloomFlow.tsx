"use client";

import { useCallback, useReducer, useState } from "react";
import type { MoodId, ToneName } from "@/lib/types";
import { TONE_PALETTES, getToday } from "@/lib/constants";
import { flowReducer, INITIAL_STATE } from "@/lib/flowReducer";
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

  const [state, dispatch] = useReducer(flowReducer, INITIAL_STATE);
  const [entries, setEntries] = useState(["", "", ""]);
  const [mood, setMood] = useState<MoodId | "">("");

  const setEntry = (i: number, v: string) =>
    setEntries((es) => es.map((e, j) => (j === i ? v : e)));

  const reset = () => {
    setEntries(["", "", ""]);
    setMood("");
    dispatch({ type: "RESET" });
  };

  const imageUrl =
    state.phase === "generated" ||
    state.phase === "reveal" ||
    state.phase === "share"
      ? state.imageUrl
      : undefined;

  const entryId =
    state.phase === "generating" ||
    state.phase === "polling" ||
    state.phase === "generated" ||
    state.phase === "reveal" ||
    state.phase === "share"
      ? state.entryId
      : undefined;

  const handleTearDone = useCallback(
    (result: { entryId: string; imageUrl: string } | { error: string; entryId?: string }) => {
      if ("error" in result) {
        dispatch({
          type: "GENERATE_FAIL",
          error: result.error,
          entryId: result.entryId,
        });
      } else {
        dispatch({
          type: "GENERATE_SUCCESS",
          entryId: result.entryId,
          imageUrl: result.imageUrl,
        });
      }
    },
    [],
  );

  const handleGenerateStart = useCallback(() => {
    // Phase B will wire this to POST /api/generate
    // For now, simulate with a placeholder that TearAwayLoading will resolve
    dispatch({
      type: "START_GENERATE",
      entryId: "placeholder",
      predictionId: "placeholder",
    });
  }, []);

  const isGenerating =
    state.phase === "generating" || state.phase === "polling";

  const showResetButton =
    state.phase === "generated" ||
    state.phase === "reveal" ||
    state.phase === "share";

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
      {state.phase === "welcome" && (
        <WelcomeScreen
          onBegin={() => dispatch({ type: "BEGIN" })}
          date={today}
        />
      )}

      {state.phase === "input" && (
        <GoodThingScreen
          key={state.step}
          index={state.step - 1}
          value={entries[state.step - 1]}
          onChange={(v) => setEntry(state.step - 1, v)}
          onNext={() => dispatch({ type: "NEXT_INPUT" })}
          onBack={() => dispatch({ type: "PREV_INPUT" })}
          palette={palette}
          particleIntensity={particleIntensity}
        />
      )}

      {state.phase === "mood" && (
        <MoodScreen
          value={mood}
          onChange={setMood}
          onNext={handleGenerateStart}
          onBack={() => dispatch({ type: "BACK_TO_INPUT" })}
          palette={palette}
        />
      )}

      {(isGenerating || state.phase === "generated") && (
        <TearAwayLoading
          entries={entries}
          mood={mood}
          date={today}
          palette={palette}
          onDone={handleTearDone}
          entryId={entryId}
        />
      )}

      {state.phase === "failed" && (
        <div
          className="paper-soft"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            padding: 32,
          }}
        >
          <div
            style={{
              fontFamily: "var(--display)",
              fontStyle: "italic",
              fontSize: 22,
              color: "var(--tone-ink)",
              textAlign: "center",
            }}
          >
            the colors didn't quite land.
          </div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "var(--tone-ink-soft)",
              textAlign: "center",
            }}
          >
            {state.error}
          </div>
          <button
            onClick={handleGenerateStart}
            style={{
              marginTop: 12,
              height: 44,
              padding: "0 24px",
              borderRadius: 22,
              border: "none",
              background: "var(--tone-ink)",
              color: "var(--tone-paper)",
              cursor: "pointer",
              fontFamily: "var(--display)",
              fontStyle: "italic",
              fontSize: 16,
              boxShadow: "0 6px 18px rgba(45,40,32,0.18)",
            }}
          >
            try again →
          </button>
          <button
            onClick={() => dispatch({ type: "BACK_TO_MOOD" })}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "var(--tone-ink-soft)",
              padding: "8px 16px",
            }}
          >
            ← back to mood
          </button>
        </div>
      )}

      {state.phase === "reveal" && (
        <RevealScreen
          entries={entries}
          mood={mood}
          date={today}
          palette={palette}
          imageUrl={imageUrl}
          onShare={() => dispatch({ type: "GO_SHARE" })}
          onBack={() => dispatch({ type: "BACK_TO_MOOD" })}
        />
      )}

      {state.phase === "share" && (
        <ShareScreen
          onBack={() => dispatch({ type: "BACK_TO_REVEAL" })}
          palette={palette}
          date={today}
          entries={entries}
          mood={mood}
          imageUrl={imageUrl}
          entryId={entryId}
        />
      )}

      {showResetButton && (
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
            padding: "8px 14px",
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
