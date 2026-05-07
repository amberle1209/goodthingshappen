"use client";

import { useState } from "react";
import type { DateInfo, Palette } from "@/lib/types";
import { GhostBtn, PrimaryBtn, StepDots } from "./ui";

interface ShareScreenProps {
  onBack: () => void;
  palette: Palette;
  date: DateInfo;
}

const SHARE_OPTIONS = [
  { id: "ig-story", label: "Instagram Story", sub: "9:16 portrait" },
  { id: "ig-post", label: "Instagram Post", sub: "1:1 square" },
  { id: "x", label: "X / Twitter", sub: "image + caption" },
  { id: "save", label: "save to camera roll", sub: "PNG · 1080×1350" },
] as const;

export function ShareScreen({ onBack, palette, date }: ShareScreenProps) {
  const [shared, setShared] = useState<string | null>(null);

  return (
    <div
      className="paper-soft"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        paddingTop: 56,
        overflow: "hidden",
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
        <GhostBtn onClick={onBack}>← card</GhostBtn>
        <StepDots step={6} />
        <span style={{ width: 50 }} />
      </div>

      <div style={{ padding: "28px 32px 0" }}>
        <div
          style={{
            fontFamily: "var(--display)",
            fontSize: 30,
            lineHeight: 1.15,
          }}
        >
          send today
          <br />
          somewhere it can{" "}
          <em style={{ color: "var(--tone-accent)" }}>land</em>.
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "var(--tone-ink-soft)",
          }}
        >
          no caption pressure. the card speaks.
        </div>
      </div>

      <div
        style={{
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {SHARE_OPTIONS.map((o) => {
          const active = shared === o.id;
          return (
            <button
              key={o.id}
              onClick={() => setShared(o.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 18px",
                borderRadius: 16,
                background: active
                  ? "var(--tone-ink)"
                  : "var(--tone-paper)",
                color: active
                  ? "var(--tone-paper)"
                  : "var(--tone-ink)",
                border: active ? "none" : "1px solid var(--tone-rule)",
                cursor: "pointer",
                transition: "all .25s",
                boxShadow: active
                  ? "0 8px 22px rgba(45,40,32,0.18)"
                  : "none",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: active
                    ? "rgba(255,255,255,0.15)"
                    : palette[0] + "22",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: active ? "var(--tone-paper)" : palette[0],
                  fontFamily: "var(--display)",
                  fontStyle: "italic",
                  fontSize: 18,
                }}
              >
                {o.id === "x" ? "✕" : o.id === "save" ? "↓" : "○"}
              </span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--display)",
                    fontStyle: "italic",
                    fontSize: 18,
                  }}
                >
                  {o.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    opacity: 0.6,
                  }}
                >
                  {o.sub}
                </div>
              </div>
              <span style={{ opacity: active ? 1 : 0.4 }}>
                {active ? "✓" : "→"}
              </span>
            </button>
          );
        })}
      </div>

      {shared && (
        <div
          style={{
            margin: "0 24px",
            padding: "14px 18px",
            borderRadius: 14,
            background: palette[1] + "1f",
            border: `1px solid ${palette[1]}55`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--display)",
            fontStyle: "italic",
            fontSize: 15,
            color: "var(--tone-ink)",
          }}
        >
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: palette[1],
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
            }}
          >
            ✓
          </span>
          off it goes. {date.month} {date.day} card sent.
        </div>
      )}

      <div style={{ marginTop: "auto", padding: "0 24px 28px" }}>
        <PrimaryBtn onClick={onBack}>done — back to card</PrimaryBtn>
      </div>
    </div>
  );
}
