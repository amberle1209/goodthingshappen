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
    <div
      role="progressbar"
      aria-valuenow={step + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${step + 1} of ${total}`}
      style={{ display: "flex", gap: 6, justifyContent: "center" }}
    >
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
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
  ariaLabel?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{
        width: "100%",
        minHeight: 52,
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
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        background: "transparent",
        border: "none",
        fontFamily: "var(--mono)",
        fontSize: 11,
        letterSpacing: 2,
        color: "var(--tone-ink-soft)",
        textTransform: "uppercase",
        cursor: "pointer",
        padding: "12px 8px",
        minHeight: 44,
        minWidth: 44,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
}
