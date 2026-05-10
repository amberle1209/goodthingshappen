"use client";

import { useEffect, useRef, useState } from "react";
import type { Palette } from "@/lib/types";
import { PROMPTS, ENCOURAGEMENTS, entryColor } from "@/lib/constants";
import { Particles } from "./Particles";
import { GhostBtn, PrimaryBtn, StepDots } from "./ui";

interface GoodThingScreenProps {
  index: number;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
  palette: Palette;
  particleIntensity?: number;
}

export function GoodThingScreen({
  index,
  value,
  onChange,
  onNext,
  onBack,
  palette,
  particleIntensity = 1,
}: GoodThingScreenProps) {
  const [keyTick, setKeyTick] = useState(0);
  const [prompt] = useState(
    () => PROMPTS[index][Math.floor(Math.random() * PROMPTS[index].length)]
  );
  const [encouragement, setEncouragement] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    taRef.current?.focus();
  }, []);

  useEffect(() => {
    const len = value.trim().length;
    if (len > 14 && !encouragement) {
      setEncouragement(
        ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]
      );
    }
    if (len < 8 && encouragement) setEncouragement("");
  }, [value, encouragement]);

  const ordinal = ["first", "second", "third"][index];
  const dotColor = entryColor(palette, index);

  return (
    <div
      className="paper-soft"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        paddingTop: 56,
      }}
    >
      {/* top: back + step dots */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 24px 0",
        }}
      >
        <GhostBtn onClick={onBack}>← back</GhostBtn>
        <StepDots step={1 + index} />
        <span style={{ width: 50 }} />
      </div>

      {/* eyebrow */}
      <div
        style={{
          padding: "24px 32px 0",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: dotColor,
            boxShadow: `0 0 0 4px ${dotColor}22`,
          }}
        />
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "var(--tone-ink-soft)",
          }}
        >
          good thing #{index + 1} of three · {ordinal}
        </span>
      </div>

      {/* prompt */}
      <div style={{ padding: "14px 32px 4px" }}>
        <div
          style={{
            fontFamily: "var(--display)",
            fontSize: 32,
            lineHeight: 1.15,
            color: "var(--tone-ink)",
            fontWeight: 400,
          }}
        >
          tell me about{" "}
          <em style={{ color: dotColor, fontStyle: "italic" }}>{prompt}</em>.
        </div>
      </div>

      {/* the input */}
      <div
        style={{
          position: "relative",
          margin: "20px 24px 0",
          flex: 1,
          background: "var(--tone-paper)",
          borderRadius: 18,
          border: "1px solid var(--tone-rule)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 14px rgba(45,40,32,0.05)",
          padding: 20,
          overflow: "visible",
        }}
      >
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setKeyTick((t) => t + 1);
          }}
          aria-label={`Good thing ${index + 1} of 3`}
          placeholder="start anywhere. the small stuff counts."
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none",
            resize: "none",
            background: "transparent",
            fontFamily: "var(--body)",
            fontSize: 19,
            lineHeight: 1.5,
            color: "var(--tone-ink)",
          }}
        />
        <Particles
          trigger={keyTick}
          intensity={particleIntensity}
          palette={palette}
        />

        {/* encouragement bubble */}
        <div
          style={{
            position: "absolute",
            right: 16,
            bottom: 12,
            fontFamily: "var(--display)",
            fontStyle: "italic",
            fontSize: 14,
            color: dotColor,
            opacity: encouragement ? 0.85 : 0,
            transform: encouragement
              ? "translateY(0)"
              : "translateY(6px)",
            transition: "all .4s cubic-bezier(.2,.7,.3,1)",
          }}
        >
          {encouragement || "·"}
        </div>
      </div>

      {/* footer */}
      <div style={{ padding: "18px 24px 28px" }}>
        <PrimaryBtn
          onClick={onNext}
          disabled={value.trim().length < 3}
        >
          {value.trim().length < 3
            ? "a few words…"
            : index < 2
              ? "next good thing →"
              : "last step →"}
        </PrimaryBtn>
      </div>
    </div>
  );
}
