"use client";

import { useEffect, useState } from "react";
import type { DateInfo, Palette } from "@/lib/types";
import { DioramaCard } from "./DioramaCard";
import { GhostBtn } from "./ui";

interface RevealScreenProps {
  entries: string[];
  mood: string;
  date: DateInfo;
  palette: Palette;
  onShare: () => void;
  onBack: () => void;
}

export function RevealScreen({
  entries,
  mood,
  date,
  palette,
  onShare,
  onBack,
}: RevealScreenProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 280);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: `radial-gradient(ellipse at top, ${palette[2]}33 0%, var(--tone-paper) 60%)`,
        display: "flex",
        flexDirection: "column",
        paddingTop: 48,
      }}
    >
      {/* slim chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 18px 0",
        }}
      >
        <GhostBtn onClick={onBack}>← edit</GhostBtn>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "var(--tone-ink-soft)",
          }}
        >
          № 001 · {date.month} {date.day}
        </span>
        <span style={{ width: 36 }} />
      </div>

      {/* card dominates */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px 14px 0",
        }}
      >
        <DioramaCard
          entries={entries}
          mood={mood}
          date={date}
          palette={palette}
          revealed={revealed}
        />
      </div>

      {/* compact footer */}
      <div
        style={{
          padding: "14px 22px 22px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            flex: 1,
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "var(--tone-ink-soft)",
            lineHeight: 1.5,
          }}
        >
          tilt cursor over the scene
          <br />
          to peek inside
        </div>
        <button
          onClick={onShare}
          style={{
            height: 40,
            padding: "0 18px",
            borderRadius: 20,
            border: "none",
            background: "var(--tone-ink)",
            color: "var(--tone-paper)",
            cursor: "pointer",
            fontFamily: "var(--display)",
            fontStyle: "italic",
            fontSize: 15,
            boxShadow: "0 6px 18px rgba(45,40,32,0.18)",
          }}
        >
          share →
        </button>
      </div>
    </div>
  );
}
