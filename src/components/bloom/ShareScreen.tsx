"use client";

import { useCallback, useState } from "react";
import type { DateInfo, Palette } from "@/lib/types";
import { track } from "@/lib/analytics";
import { GhostBtn, PrimaryBtn, StepDots } from "./ui";

interface ShareScreenProps {
  onBack: () => void;
  palette: Palette;
  date: DateInfo;
  entries?: string[];
  mood?: string;
  imageUrl?: string;
  entryId?: string;
}

type ShareStatus = "idle" | "downloading" | "sharing" | "done" | "error";

export function ShareScreen({
  onBack,
  palette,
  date,
  entryId,
}: ShareScreenProps) {
  const [status, setStatus] = useState<ShareStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const cardUrl = entryId ? `/api/card/${entryId}.png` : null;

  const handleDownload = useCallback(async () => {
    if (!cardUrl) return;
    track({ event: "card_shared", method: "download" });
    setStatus("downloading");
    try {
      const res = await fetch(cardUrl);
      if (!res.ok) throw new Error("Failed to download card");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bloom-${date.month}-${date.day}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatus("done");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Download failed");
      setStatus("error");
    }
  }, [cardUrl, date]);

  const handleWebShare = useCallback(async () => {
    if (!cardUrl) return;
    track({ event: "card_shared", method: "native" });
    setStatus("sharing");
    try {
      const res = await fetch(cardUrl);
      if (!res.ok) throw new Error("Failed to load card");
      const blob = await res.blob();
      const file = new File([blob], `bloom-${date.month}-${date.day}.png`, {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `Bloom · ${date.month} ${date.day}`,
          text: "three good things today",
          files: [file],
        });
        setStatus("done");
      } else {
        // Fallback to download
        handleDownload();
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setStatus("idle");
        return;
      }
      setErrorMsg(err instanceof Error ? err.message : "Share failed");
      setStatus("error");
    }
  }, [cardUrl, date, handleDownload]);

  const handleShareX = useCallback(() => {
    track({ event: "card_shared", method: "twitter" });
    const text = encodeURIComponent("three good things today ✦ #bloom");
    const url = entryId
      ? encodeURIComponent(`${window.location.origin}/api/card/${entryId}.png`)
      : "";
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "noopener",
    );
    setStatus("done");
  }, [entryId]);

  const SHARE_OPTIONS = [
    {
      id: "share" as const,
      label: "Share",
      sub: "native share sheet",
      icon: "↗",
      action: handleWebShare,
    },
    {
      id: "x" as const,
      label: "X / Twitter",
      sub: "image + caption",
      icon: "✕",
      action: handleShareX,
    },
    {
      id: "save" as const,
      label: "save to device",
      sub: "PNG · 1080×1920",
      icon: "↓",
      action: handleDownload,
    },
  ];

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
        {SHARE_OPTIONS.map((o) => (
          <button
            key={o.id}
            onClick={o.action}
            disabled={status === "downloading" || status === "sharing"}
            aria-label={o.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 18px",
              borderRadius: 16,
              background: "var(--tone-paper)",
              color: "var(--tone-ink)",
              border: "1px solid var(--tone-rule)",
              cursor:
                status === "downloading" || status === "sharing"
                  ? "wait"
                  : "pointer",
              transition: "all .25s",
              textAlign: "left",
              minHeight: 44,
              opacity:
                status === "downloading" || status === "sharing" ? 0.6 : 1,
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: palette[0] + "22",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: palette[0],
                fontFamily: "var(--display)",
                fontStyle: "italic",
                fontSize: 18,
              }}
            >
              {o.icon}
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
            <span style={{ opacity: 0.4 }}>→</span>
          </button>
        ))}
      </div>

      {status === "done" && (
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

      {status === "error" && (
        <div
          style={{
            margin: "0 24px",
            padding: "14px 18px",
            borderRadius: 14,
            background: "rgba(200,60,60,0.08)",
            border: "1px solid rgba(200,60,60,0.2)",
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: 1,
            color: "var(--tone-ink-soft)",
          }}
        >
          {errorMsg || "something didn't work. try again?"}
        </div>
      )}

      <div style={{ marginTop: "auto", padding: "0 24px 28px" }}>
        <PrimaryBtn onClick={onBack}>done — back to card</PrimaryBtn>
      </div>
    </div>
  );
}
