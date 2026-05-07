"use client";

import { useEffect, useRef, useState } from "react";
import type { Palette } from "@/lib/types";

interface Bit {
  id: number;
  x: number;
  y: number;
  dx: number;
  rot: number;
  size: number;
  hue: string;
  kind: "petal" | "dot";
  dur: number;
}

interface ParticlesProps {
  trigger: number;
  intensity?: number;
  palette: Palette;
}

export function Particles({ trigger, intensity = 1, palette }: ParticlesProps) {
  const [bits, setBits] = useState<Bit[]>([]);
  const counterRef = useRef(0);
  const lastTriggerRef = useRef(trigger);

  useEffect(() => {
    if (trigger === lastTriggerRef.current) return;
    lastTriggerRef.current = trigger;
    if (intensity <= 0) return;

    const n = Math.max(1, Math.round(2 * intensity));
    const fresh: Bit[] = [];
    for (let i = 0; i < n; i++) {
      counterRef.current += 1;
      fresh.push({
        id: counterRef.current,
        x: 50 + (Math.random() - 0.5) * 60,
        y: 50 + (Math.random() - 0.5) * 30,
        dx: (Math.random() - 0.5) * 80,
        rot: (Math.random() - 0.5) * 90,
        size: 6 + Math.random() * 10,
        hue: palette[Math.floor(Math.random() * palette.length)],
        kind: Math.random() > 0.5 ? "petal" : "dot",
        dur: 1.2 + Math.random() * 0.8,
      });
    }

    setBits((b) => [...b.slice(-30), ...fresh]);
    const freshIds = new Set(fresh.map((f) => f.id));
    const tid = setTimeout(() => {
      setBits((b) => b.filter((p) => !freshIds.has(p.id)));
    }, 2200);
    return () => clearTimeout(tid);
  }, [trigger, intensity, palette]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {bits.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            transform: "translate(-50%,-50%)",
            animation: `float-up ${p.dur}s cubic-bezier(.2,.7,.3,1) forwards`,
            "--dx": `${p.dx}px`,
            "--rot": `${p.rot}deg`,
          } as React.CSSProperties}
        >
          {p.kind === "petal" ? (
            <svg viewBox="0 0 16 16" width={p.size} height={p.size}>
              <path
                d="M8 1 C 11 5, 13 8, 8 15 C 3 8, 5 5, 8 1 Z"
                fill={p.hue}
                opacity="0.85"
              />
            </svg>
          ) : (
            <span
              style={{
                display: "block",
                width: p.size * 0.4,
                height: p.size * 0.4,
                borderRadius: "50%",
                background: p.hue,
                opacity: 0.7,
              }}
            />
          )}
        </span>
      ))}
    </div>
  );
}
