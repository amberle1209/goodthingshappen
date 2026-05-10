"use client";

import type { MoodId, Palette } from "@/lib/types";
import { MOODS } from "@/lib/constants";
import { GhostBtn, PrimaryBtn, StepDots } from "./ui";

interface MoodScreenProps {
  value: string;
  onChange: (id: MoodId) => void;
  onNext: () => void;
  onBack: () => void;
  palette: Palette;
}

export function MoodScreen({
  value,
  onChange,
  onNext,
  onBack,
  palette,
}: MoodScreenProps) {
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 24px 0",
        }}
      >
        <GhostBtn onClick={onBack}>← back</GhostBtn>
        <StepDots step={4} />
        <span style={{ width: 50 }} />
      </div>

      <div style={{ padding: "28px 32px 0" }}>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "var(--tone-ink-soft)",
          }}
        >
          one last thing
        </div>
        <div
          style={{
            fontFamily: "var(--display)",
            fontSize: 32,
            lineHeight: 1.15,
            marginTop: 8,
          }}
        >
          today felt mostly…{" "}
          <em style={{ color: "var(--tone-accent)" }}>{value || "?"}</em>
        </div>
      </div>

      <div
        role="group"
        aria-label="Select your mood"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
          padding: "24px 24px 0",
        }}
      >
        {MOODS.map((m) => {
          const active = value === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onChange(m.id)}
              aria-label={`Mood: ${m.label}`}
              aria-pressed={active}
              style={{
                aspectRatio: "1 / 1",
                borderRadius: 22,
                border: active
                  ? "1.5px solid var(--tone-ink)"
                  : "1px solid var(--tone-rule)",
                background: active
                  ? "var(--tone-paper)"
                  : "rgba(255,255,255,0.4)",
                boxShadow: active
                  ? "0 8px 22px rgba(45,40,32,0.14), inset 0 1px 0 rgba(255,255,255,0.7)"
                  : "inset 0 1px 0 rgba(255,255,255,0.6)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                cursor: "pointer",
                transition: "all .25s",
                transform: active ? "translateY(-2px)" : "none",
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  color: palette[m.tint],
                  filter: active ? "none" : "grayscale(0.3)",
                }}
              >
                {m.symbol}
              </span>
              <span
                style={{
                  fontFamily: "var(--display)",
                  fontStyle: "italic",
                  fontSize: 16,
                  color: "var(--tone-ink)",
                }}
              >
                {m.label}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: "auto", padding: "0 24px 28px" }}>
        <PrimaryBtn onClick={onNext} disabled={!value}>
          {value ? "paint my day →" : "pick one"}
        </PrimaryBtn>
      </div>
    </div>
  );
}
