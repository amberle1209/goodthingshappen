"use client";

import { useEffect, useRef, useState } from "react";
import type { DateInfo, Palette } from "@/lib/types";
import { LOAD_LINES, entryColor } from "@/lib/constants";

/* ─── Page body shown during tear ────────────────────── */

function PageBody({
  entries,
  mood,
  date,
  palette,
}: {
  entries: string[];
  mood: string;
  date: DateInfo;
  palette: Palette;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        padding: "50px 32px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div
          style={{
            fontFamily: "var(--display)",
            fontStyle: "italic",
            fontSize: 56,
            lineHeight: 1,
            color: "var(--tone-ink)",
          }}
        >
          {date.day}
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "var(--tone-ink-soft)",
            }}
          >
            {date.weekday}
          </div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "var(--tone-ink-soft)",
            }}
          >
            {date.month} {date.year}
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: 30,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        {entries.map((e, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                flexShrink: 0,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: entryColor(palette, i),
                boxShadow: `0 0 0 4px ${entryColor(palette, i)}22`,
                marginTop: 6,
              }}
            />
            <div
              style={{
                flex: 1,
                borderBottom: "1px solid var(--tone-rule)",
                paddingBottom: 10,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--display)",
                  fontStyle: "italic",
                  fontSize: 17,
                  lineHeight: 1.4,
                  color: "var(--tone-ink)",
                }}
              >
                {e || "—"}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 32,
          right: 32,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "var(--tone-ink-soft)",
        }}
      >
        <span>mood · {mood}</span>
        <span>sealing…</span>
      </div>
    </div>
  );
}

/* ─── Curling page top strip ─────────────────────────── */

function CurlingPage({
  entries,
  mood,
  date,
  palette,
  curl,
}: {
  entries: string[];
  mood: string;
  date: DateInfo;
  palette: Palette;
  curl: number;
}) {
  const topRotate = curl * -28;
  const topShift = curl * -8;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="paper"
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "0 4px 14px rgba(45,40,32,0.10)",
        }}
      >
        <PageBody
          entries={entries}
          mood={mood}
          date={date}
          palette={palette}
        />
      </div>
      <div
        className="paper"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          transformOrigin: "50% 0%",
          transform: `translateY(${topShift}px) rotateX(${topRotate}deg)`,
          transition: "transform 0.7s cubic-bezier(.4,0,.2,1)",
          boxShadow:
            curl > 0.1
              ? "0 8px 14px rgba(45,40,32,0.18)"
              : "none",
          backfaceVisibility: "visible",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, rgba(45,40,32,${0.05 + curl * 0.1}) 0%, rgba(45,40,32,0) 60%)`,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Loading underlay (ink bloom) ───────────────────── */

function LoadingUnderlay({
  phase,
  palette,
}: {
  phase: number;
  palette: Palette;
  mood: string;
}) {
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    if (phase < 3) return;
    setLineIdx(0);
    const id = setInterval(
      () => setLineIdx((i) => (i + 1) % LOAD_LINES.length),
      900
    );
    return () => clearInterval(id);
  }, [phase]);

  const visible = phase >= 3;

  return (
    <div
      className="paper-soft"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        padding: 32,
        overflow: "hidden",
        opacity: phase >= 2 ? 1 : 0,
        transition: "opacity 0.8s ease 0.4s",
      }}
    >
      <div style={{ position: "relative", width: 180, height: 180 }}>
        {palette.slice(0, 3).map((c, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%,-50%) translate(${[0, -32, 32][i]}px,${[-22, 22, 22][i]}px)`,
              width: 110,
              height: 110,
              borderRadius: "50%",
              background: c,
              opacity: 0.55,
              filter: "blur(22px)",
              animation: visible
                ? `ink-bloom 2.2s ease-in-out ${i * 0.35}s infinite`
                : "none",
              visibility: visible ? "visible" : "hidden",
            }}
          />
        ))}
      </div>
      <div
        style={{
          height: 28,
          position: "relative",
          width: "100%",
          textAlign: "center",
        }}
      >
        {LOAD_LINES.map((l, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              fontFamily: "var(--display)",
              fontStyle: "italic",
              fontSize: 18,
              color: "var(--tone-ink-soft)",
              opacity: visible && lineIdx === i ? 1 : 0,
              transform: `translateY(${lineIdx === i ? 0 : 8}px)`,
              transition: "all .4s cubic-bezier(.2,.7,.3,1)",
            }}
          >
            {l}
          </div>
        ))}
      </div>
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "var(--tone-ink-soft)",
          opacity: 0.5,
          visibility: visible ? "visible" : "hidden",
        }}
      >
        AI is painting today · ~10s
      </div>
    </div>
  );
}

/* ─── Main TearAwayLoading ───────────────────────────── */

const MIN_ANIMATION_MS = 4500;

interface TearAwayLoadingProps {
  entries: string[];
  mood: string;
  date: DateInfo;
  palette: Palette;
  onDone: (
    result: { entryId: string; imageUrl: string } | { error: string },
  ) => void;
  entryId?: string;
}

export function TearAwayLoading({
  entries,
  mood,
  date,
  palette,
  onDone,
  entryId,
}: TearAwayLoadingProps) {
  const [phase, setPhase] = useState(0);
  const doneCalledRef = useRef(false);
  const apiResultRef = useRef<
    { entryId: string; imageUrl: string } | { error: string } | null
  >(null);
  const animDoneRef = useRef(false);

  const tryFinish = () => {
    if (doneCalledRef.current) return;
    if (!animDoneRef.current || !apiResultRef.current) return;
    doneCalledRef.current = true;
    onDone(apiResultRef.current);
  };

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 3200);
    const tMin = setTimeout(() => {
      animDoneRef.current = true;
      tryFinish();
    }, MIN_ANIMATION_MS);
    return () => [t1, t2, t3, tMin].forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!entryId || entryId === "placeholder") {
      // Phase B will replace this with real API polling.
      // For now, simulate success after a delay.
      const t = setTimeout(() => {
        apiResultRef.current = {
          entryId: "simulated-id",
          imageUrl: "",
        };
        tryFinish();
      }, 3000);
      return () => clearTimeout(t);
    }
    // When real API is wired, this effect will poll /api/generate/status
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entryId]);

  const sheetTransform = (() => {
    if (phase === 0) return "translateY(0) rotate(0) scale(1)";
    if (phase === 1) return "translateY(-3px) rotate(-0.4deg) scale(1)";
    if (phase >= 2) return "translate(18px, -130%) rotate(-26deg) scale(0.86)";
    return "";
  })();

  const sheetCurl = (() => {
    if (phase === 0) return 0;
    if (phase === 1) return 0.25;
    return 1;
  })();

  const sheetOpacity = phase >= 3 ? 0 : 1;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: "var(--tone-bg)",
        perspective: 1400,
      }}
    >
      {/* underneath: loading message */}
      <LoadingUnderlay phase={phase} palette={palette} mood={mood} />

      {/* binder edge stub */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 38,
          background: "var(--tone-paper)",
          borderBottom: "1px dashed rgba(0,0,0,0.18)",
          zIndex: 6,
          opacity: phase >= 3 ? 0 : 1,
          transition: "opacity 1s ease 0.6s",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-around",
            padding: "0 24px",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.18)",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
              }}
            />
          ))}
        </div>
      </div>

      {/* the page itself */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          top: 38,
          zIndex: 5,
          transformStyle: "preserve-3d",
          transformOrigin: "50% 0%",
          transform: sheetTransform,
          opacity: sheetOpacity,
          transition:
            phase === 0
              ? "none"
              : phase === 1
                ? "transform 0.6s cubic-bezier(.4,0,.2,1)"
                : "transform 1.6s cubic-bezier(.6,0,.2,1), opacity 0.9s ease 0.9s",
          filter:
            phase >= 2
              ? "drop-shadow(0 22px 30px rgba(45,40,32,0.28))"
              : "none",
        }}
      >
        <CurlingPage
          entries={entries}
          mood={mood}
          date={date}
          palette={palette}
          curl={sheetCurl}
        />
      </div>

      {/* tearing rip line */}
      <div
        style={{
          position: "absolute",
          top: 38,
          left: 0,
          right: 0,
          height: 6,
          background: `repeating-linear-gradient(90deg, ${palette[0]}55 0 3px, transparent 3px 6px)`,
          opacity: phase === 1 ? 0.8 : phase === 2 ? 0.4 : 0,
          filter: "blur(0.5px)",
          transition: "opacity 0.4s",
          zIndex: 7,
        }}
      />
    </div>
  );
}
