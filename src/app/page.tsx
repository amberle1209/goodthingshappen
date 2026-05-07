"use client";

import { BloomFlow } from "@/components/bloom/BloomFlow";

export default function Home() {
  return (
    <main
      style={{
        width: "100vw",
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ece7da",
      }}
    >
      {/* Mobile-first: full viewport on small screens, phone frame on desktop */}
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          height: "100%",
          maxHeight: 932,
          position: "relative",
          overflow: "hidden",
          borderRadius: "0",
        }}
        className="sm:rounded-[40px] sm:shadow-2xl"
      >
        <BloomFlow tone="ghibli" particleIntensity={1} />
      </div>
    </main>
  );
}
