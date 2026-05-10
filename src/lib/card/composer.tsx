import type { Palette } from "../types";
import { entryColor } from "../constants";

interface CardData {
  entries: string[];
  mood: string;
  date: { day: number; month: string; year: number; weekday: string };
  palette: Palette;
  imageUrl?: string;
}

/**
 * Satori-compatible JSX layout for share cards.
 * Satori limitations: no blur, no radial-gradient, no perspective, no line-clamp.
 * This is a simplified "flat" layout optimized for those constraints.
 */
export function CardLayout({ data }: { data: CardData }) {
  const hasImage = !!data.imageUrl;

  return (
    <div
      style={{
        width: "1080px",
        height: "1920px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "serif",
        position: "relative",
        overflow: "hidden",
        background: hasImage ? "#000" : `linear-gradient(135deg, ${data.palette[0]}44, ${data.palette[2]}44, ${data.palette[1]}44)`,
      }}
    >
      {/* Background image */}
      {hasImage && (
        <img
          src={data.imageUrl}
          width={1080}
          height={1920}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1080px",
            height: "1920px",
            objectFit: "cover",
            opacity: 0.85,
          }}
        />
      )}

      {/* Overlay for text readability */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "960px",
          display: "flex",
          background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))",
        }}
      />

      {/* Top date header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "80px 72px 0",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: "140px",
            lineHeight: 1,
            color: "#fff",
            fontStyle: "italic",
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
            display: "flex",
          }}
        >
          {data.date.day}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            paddingTop: "20px",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              letterSpacing: "6px",
              textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.8)",
              display: "flex",
            }}
          >
            {data.date.weekday}
          </div>
          <div
            style={{
              fontSize: "24px",
              letterSpacing: "4px",
              textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.6)",
              display: "flex",
            }}
          >
            {data.date.month} {data.date.year}
          </div>
        </div>
      </div>

      {/* Entries at bottom */}
      <div
        style={{
          marginTop: "auto",
          padding: "0 72px 100px",
          display: "flex",
          flexDirection: "column",
          gap: "48px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {data.entries.map((entry, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "28px",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "12px",
                background: entryColor(data.palette, i),
                flexShrink: 0,
                marginTop: "8px",
                display: "flex",
              }}
            />
            <div
              style={{
                fontSize: "42px",
                lineHeight: 1.4,
                color: "#fff",
                fontStyle: "italic",
                textShadow: "0 2px 12px rgba(0,0,0,0.3)",
                display: "flex",
              }}
            >
              {entry}
            </div>
          </div>
        ))}

        {/* Mood + branding footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <div
            style={{
              fontSize: "22px",
              letterSpacing: "4px",
              textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.5)",
              display: "flex",
            }}
          >
            mood · {data.mood}
          </div>
          <div
            style={{
              fontSize: "22px",
              letterSpacing: "6px",
              textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.4)",
              display: "flex",
            }}
          >
            BLOOM
          </div>
        </div>
      </div>
    </div>
  );
}
