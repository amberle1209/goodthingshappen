// bloom-diorama.jsx — a real 3D miniature scene inside the calendar card.
// The CARD does not move. The diorama inside (sky / sun / hills / meadow /
// foreground markers) tilts and parallaxes against pointer + device tilt.
//
// ─── How this becomes AI-generated and STAYS interactive ───
// The 8-layer stack below is the runtime contract. When you wire Flux Schnell:
//
// Phase 1 (MVP, $0.003/card) — single-image + CSS mask slicing:
//   Have Flux generate ONE watercolor scene with the same fixed composition
//   (sky band / sun blob top-right / far hills 50% / mid hills 65% /
//    meadow 80% / 3 marker dots). On the client, slice it into 3 horizontal
//    bands via -webkit-mask-image and drop each band into the layer slots
//    below at depth -2 / -0.4 / 0.8. Soft watercolor edges hide seams.
//
// Phase 2 ($0.012/card) — multi-layer generation:
//   Prompt Flux for 3-4 PNGs with transparency (sky+sun, hills, foreground).
//   Each goes straight into a layer slot. Best fidelity, no slicing artifacts.
//
// Phase 3 ($0.01/card) — depth-map displacement:
//   Flux + MiDaS/ZoeDepth → RGB + depth. Use a tiny WebGL pass to displace
//   pixels along the depth gradient in response to pointer. True 3D peek.
//
// IMPORTANT: in all 3 phases, the parallax math, the tilt-on-pointer
// listener, and the layer DOM structure stay identical to what's here.
// You're only swapping the visual content of each layer. The interactivity
// is owned by the prototype, not the AI.
// ─────────────────────────────────────────────────────────────────────────

const { useState: useStateD, useEffect: useEffectD, useRef: useRefD } = React;

function DioramaCard({ entries, mood, date, palette, revealed }) {
  const sceneRef = useRefD(null);
  const [tilt, setTilt] = useStateD({ x: 0, y: 0 });

  useEffectD(() => {
    const el = sceneRef.current; if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top)  / r.height - 0.5;
      setTilt({ x: cx, y: cy });
    };
    const onTouch = (e) => {
      const t = e.touches[0]; if (!t) return;
      const r = el.getBoundingClientRect();
      const cx = (t.clientX - r.left) / r.width - 0.5;
      const cy = (t.clientY - r.top)  / r.height - 0.5;
      setTilt({ x: cx, y: cy });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('touchmove', onTouch, { passive: true });
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('touchmove', onTouch);
    };
  }, []);

  const [accent, leaf, sky, sun] = palette;
  // tilt -> layer offsets
  const lx = tilt.x; const ly = tilt.y;
  const layer = (depth) => ({
    transform: `translate3d(${lx * depth * 24}px, ${ly * depth * 14}px, 0)`,
    transition: 'transform .25s cubic-bezier(.2,.7,.3,1)',
  });
  // entire diorama bowl tilts a bit too
  const bowlTilt = {
    transform: `rotateX(${-ly * 8}deg) rotateY(${lx * 10}deg)`,
    transition: 'transform .35s cubic-bezier(.2,.7,.3,1)',
  };

  return (
    <div style={{
      width: 320, height: 540, perspective: 1200,
      transform: revealed ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(20px)',
      opacity: revealed ? 1 : 0,
      transition: 'all 1s cubic-bezier(.2,.7,.3,1)',
    }}>
      <div className="paper" style={{
        width: '100%', height: '100%', borderRadius: 22,
        boxShadow: '0 30px 60px rgba(45,40,32,0.28), 0 0 0 1px rgba(45,40,32,0.06)',
        overflow: 'hidden', position: 'relative',
      }}>
        {/* date stripe */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 4,
          padding: '14px 18px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        }}>
          <div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 22, color: 'var(--tone-ink)' }}>
            bloom
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--tone-ink-soft)' }}>
            {date.weekday} · {date.month} {date.day}
          </div>
        </div>

        {/* ─── DIORAMA WINDOW — now dominates the card ─── */}
        <div ref={sceneRef} style={{
          position: 'absolute', top: 44, left: 14, right: 14, height: 410,
          borderRadius: 16, overflow: 'hidden',
          background: `linear-gradient(180deg, ${sky}55 0%, ${sky}22 50%, var(--tone-paper) 100%)`,
          boxShadow: 'inset 0 6px 14px rgba(45,40,32,0.06), inset 0 -2px 8px rgba(45,40,32,0.04)',
          perspective: 700, perspectiveOrigin: '50% 60%',
          cursor: 'grab',
        }}>
          <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', ...bowlTilt }}>
            {/* layer 1: sun */}
            <div style={{
              position: 'absolute', top: 40, right: 50,
              width: 130, height: 130, borderRadius: '50%',
              background: `radial-gradient(circle, ${sun}cc 0%, ${sun}66 40%, transparent 70%)`,
              ...layer(-2),
            }}/>
            <div style={{
              position: 'absolute', top: 86, right: 92,
              width: 32, height: 32, borderRadius: '50%', background: sun, opacity: 0.7,
              ...layer(-2),
            }}/>

            {/* layer 2: far hills */}
            <svg viewBox="0 0 320 410" preserveAspectRatio="none" style={{
              position: 'absolute', inset: 0, ...layer(-1.2),
            }}>
              <path d="M0 240 Q 80 180 160 210 T 320 195 L 320 410 L 0 410 Z"
                fill={leaf} opacity="0.32" filter="blur(2px)"/>
            </svg>

            {/* layer 3: birds */}
            <div style={{ position: 'absolute', top: 140, left: 80, ...layer(-0.4) }}>
              <svg width="56" height="18" viewBox="0 0 56 18">
                <path d="M2 10 Q 8 2, 14 10 Q 20 2, 26 10" stroke={accent} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                <path d="M30 8 Q 36 0, 42 8 Q 48 0, 54 8" stroke={accent} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7"/>
              </svg>
            </div>

            {/* layer 4: mid hills */}
            <svg viewBox="0 0 320 410" preserveAspectRatio="none" style={{
              position: 'absolute', inset: 0, ...layer(-0.4),
            }}>
              <path d="M0 290 Q 100 250 200 270 T 320 260 L 320 410 L 0 410 Z"
                fill={leaf} opacity="0.55"/>
            </svg>

            {/* layer 5: tree */}
            <div style={{
              position: 'absolute', bottom: 90, left: 48, ...layer(0.5),
            }}>
              <svg width="50" height="86" viewBox="0 0 50 86">
                <line x1="25" y1="86" x2="25" y2="50" stroke={'#3a2e22'} strokeWidth="3" strokeLinecap="round"/>
                <ellipse cx="25" cy="32" rx="22" ry="26" fill={leaf} opacity="0.85"/>
                <ellipse cx="16" cy="26" rx="9" ry="10" fill={leaf} opacity="0.95"/>
                <ellipse cx="32" cy="20" rx="9" ry="10" fill={leaf}/>
              </svg>
            </div>

            {/* layer 6: meadow */}
            <svg viewBox="0 0 320 410" preserveAspectRatio="none" style={{
              position: 'absolute', inset: 0, ...layer(0.8),
            }}>
              <path d="M0 340 Q 100 320 200 345 T 320 335 L 320 410 L 0 410 Z"
                fill={accent} opacity="0.4"/>
            </svg>

            {/* layer 7: 3 markers */}
            <div style={{ position: 'absolute', inset: 0, ...layer(1.5) }}>
              <Marker x={75}  y={360} color={palette[0]} label="1"/>
              <Marker x={170} y={372} color={palette[1]} label="2"/>
              <Marker x={250} y={358} color={palette[3]} label="3"/>
            </div>

            {/* layer 8: foreground petals */}
            <div style={{ position: 'absolute', inset: 0, ...layer(2.4), pointerEvents: 'none' }}>
              <Petal x={28} y={388} c={accent} s={11}/>
              <Petal x={295} y={376} c={leaf} s={13}/>
              <Petal x={58} y={398} c={sun} s={9}/>
            </div>
          </div>

          {/* tilt hint inside */}
          <div style={{
            position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
            fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: 2,
            textTransform: 'uppercase', color: 'var(--tone-ink-soft)',
            opacity: Math.abs(lx) + Math.abs(ly) > 0.05 ? 0 : 0.5,
            transition: 'opacity .3s', pointerEvents: 'none',
          }}>↶ peek inside</div>
        </div>

        {/* tiny entries strip — caption style, hangs below scene */}
        <div style={{
          position: 'absolute', left: 14, right: 14, bottom: 10,
          display: 'flex', gap: 6, alignItems: 'flex-start',
          padding: '8px 4px',
        }}>
          {entries.map((e, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', gap: 5, alignItems: 'flex-start', minWidth: 0 }}>
              <span style={{
                flexShrink: 0, width: 6, height: 6, borderRadius: '50%',
                background: palette[i === 2 ? 3 : i],
                marginTop: 4,
              }}/>
              <span style={{
                fontFamily: 'var(--display)', fontStyle: 'italic',
                fontSize: 9, lineHeight: 1.3, color: 'var(--tone-ink)',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>{e || '—'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Marker({ x, y, color, label }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: 'translate(-50%, -100%)',
    }}>
      {/* pin */}
      <svg width="22" height="32" viewBox="0 0 22 32">
        <path d="M11 30 L4 14 Q 4 4 11 4 Q 18 4 18 14 Z" fill={color}/>
        <circle cx="11" cy="12" r="3.5" fill="rgba(255,255,255,0.9)"/>
      </svg>
      <div style={{
        position: 'absolute', top: 4, left: 11, transform: 'translate(-50%, -50%)',
        fontFamily: 'var(--mono)', fontSize: 8, color, fontWeight: 600,
      }}>{label}</div>
    </div>
  );
}

function Petal({ x, y, c, s }) {
  return (
    <svg style={{ position: 'absolute', left: x, top: y }} width={s*2} height={s*2} viewBox="0 0 16 16">
      <path d="M8 1 C 11 5, 13 8, 8 15 C 3 8, 5 5, 8 1 Z" fill={c} opacity="0.85"/>
    </svg>
  );
}

Object.assign(window, { DioramaCard });
