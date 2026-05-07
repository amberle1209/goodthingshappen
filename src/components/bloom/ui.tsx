"use client";

import type { CSSProperties, ReactNode } from "react";

/* ─── Step progress dots ─────────────────────────────── */

export function StepDots({
  step,
  total = 7,
}: {
  step: number;
  total?: number;
}) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          style={{
            width: i === step ? 18 : 6,
            height: 6,
            borderRadius: 3,
            background:
              i <= step ? "var(--tone-ink)" : "var(--tone-rule)",
            opacity: i <= step ? 0.85 : 1,
            transition: "all .3s cubic-bezier(.2,.7,.3,1)",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Primary button ─────────────────────────────────── */

export function PrimaryBtn({
  children,
  onClick,
  disabled,
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        height: 52,
        border: "none",
        borderRadius: 26,
        background: disabled
          ? "rgba(45,40,32,0.12)"
          : "var(--tone-ink)",
        color: disabled
          ? "var(--tone-ink-soft)"
          : "var(--tone-paper)",
        fontFamily: "var(--display)",
        fontStyle: "italic",
        fontSize: 18,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all .25s",
        letterSpacing: 0.2,
        boxShadow: disabled
          ? "none"
          : "0 8px 22px rgba(45,40,32,0.18)",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/* ─── Ghost button ───────────────────────────────────── */

export function GhostBtn({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        fontFamily: "var(--mono)",
        fontSize: 11,
        letterSpacing: 2,
        color: "var(--tone-ink-soft)",
        textTransform: "uppercase",
        cursor: "pointer",
        padding: 8,
      }}
    >
      {children}
    </button>
  );
}
