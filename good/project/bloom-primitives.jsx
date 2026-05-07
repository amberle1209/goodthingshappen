// bloom-primitives.jsx — particles, paper texture, parallax, tear page
// Primitives that the screens compose. Globally exported on window.

const { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } = React;

/* ─────────────────────────────────────────────────────────
   Petal / ink particle field — flicks particles out on key
   ───────────────────────────────────────────────────────── */
function Particles({ trigger, intensity = 1, palette }) {
  // `trigger` is a number that increments per keystroke
  const [bits, setBits] = useState([]);
  const counterRef = useRef(0);
  const lastTriggerRef = useRef(trigger);

  useEffect(() => {
    if (trigger === lastTriggerRef.current) return;
    lastTriggerRef.current = trigger;
    if (intensity <= 0) return;
    const n = Math.max(1, Math.round(2 * intensity));
    const fresh = [];
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
        kind: Math.random() > 0.5 ? 'petal' : 'dot',
        dur: 1.2 + Math.random() * 0.8,
      });
    }
    setBits((b) => [...b.slice(-30), ...fresh]);
    const tid = setTimeout(() => {
      setBits((b) => b.filter((p) => !fresh.includes(p)));
    }, 2200);
    return () => clearTimeout(tid);
  }, [trigger, intensity, palette]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
      {bits.map((p) => (
        <span key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            transform: `translate(-50%,-50%)`,
            animation: `float-up ${p.dur}s cubic-bezier(.2,.7,.3,1) forwards`,
            ['--dx']: `${p.dx}px`,
            ['--rot']: `${p.rot}deg`,
          }}>
          {p.kind === 'petal' ? (
            <svg viewBox="0 0 16 16" width={p.size} height={p.size}>
              <path
                d="M8 1 C 11 5, 13 8, 8 15 C 3 8, 5 5, 8 1 Z"
                fill={p.hue} opacity="0.85"/>
            </svg>
          ) : (
            <span style={{
              display: 'block', width: p.size * 0.4, height: p.size * 0.4,
              borderRadius: '50%', background: p.hue, opacity: 0.7,
            }}/>
          )}
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Parallax scene — multiple layers that drift on tilt/cursor
   ───────────────────────────────────────────────────────── */
function ParallaxScene({ children, depth = 1, style }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let raf = 0; let target = { x: 0, y: 0 };
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top)  / r.height - 0.5;
      target = { x: cx, y: cy };
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setTilt(target));
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div ref={ref}
      style={{ position: 'relative', perspective: 1400, transformStyle: 'preserve-3d', ...style }}
      data-tilt-x={tilt.x} data-tilt-y={tilt.y}>
      {React.Children.map(children, (child, i) => {
        if (!child) return null;
        const d = child.props?.depth ?? (i - 1);
        const k = depth * d;
        return React.cloneElement(child, {
          style: {
            ...child.props.style,
            transform: `${child.props.style?.transform || ''} translate3d(${tilt.x * 24 * k}px, ${tilt.y * 18 * k}px, ${k * 30}px)`,
            transition: 'transform .25s cubic-bezier(.2,.7,.3,1)',
          },
        });
      })}
    </div>
  );
}
function ParallaxLayer({ children, depth = 0, style }) {
  return <div style={{ position: 'absolute', inset: 0, ...style }} data-depth={depth}>{children}</div>;
}

/* ─────────────────────────────────────────────────────────
   Watercolor scene SVG — used inside the calendar card
   Three layers a parent ParallaxScene can offset.
   ───────────────────────────────────────────────────────── */
function WatercolorScene({ palette, mood = 'calm' }) {
  const [accent, leaf, sky, sun] = palette;
  return (
    <svg viewBox="0 0 320 220" width="100%" height="100%" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="wc-sky" cx="50%" cy="20%" r="80%">
          <stop offset="0%" stopColor={sky} stopOpacity="0.55"/>
          <stop offset="60%" stopColor={sky} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={sky} stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="wc-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={sun} stopOpacity="0.8"/>
          <stop offset="60%" stopColor={sun} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={sun} stopOpacity="0"/>
        </radialGradient>
        <filter id="wc-blur"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>
      {/* sky wash */}
      <rect x="0" y="0" width="320" height="220" fill="url(#wc-sky)"/>
      {/* sun */}
      <circle cx="240" cy="60" r="48" fill="url(#wc-sun)"/>
      <circle cx="240" cy="60" r="14" fill={sun} opacity="0.5"/>
      {/* far hills */}
      <path d="M0 150 Q 60 110 130 130 T 320 120 L 320 220 L 0 220 Z"
        fill={leaf} opacity="0.32" filter="url(#wc-blur)"/>
      {/* mid hills */}
      <path d="M0 175 Q 80 145 160 165 T 320 155 L 320 220 L 0 220 Z"
        fill={leaf} opacity="0.5"/>
      {/* foreground meadow */}
      <path d="M0 195 Q 100 180 200 195 T 320 195 L 320 220 L 0 220 Z"
        fill={accent} opacity="0.35"/>
      {/* 3 markers — the inputs */}
      <g>
        <circle cx="60"  cy="190" r="6" fill={accent}/>
        <circle cx="160" cy="200" r="6" fill={leaf}/>
        <circle cx="245" cy="192" r="6" fill={sun}/>
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   Tear sheet — perforated header that the user "tears"
   variant: 'calendar' | 'sticky' | 'envelope'
   ───────────────────────────────────────────────────────── */
function TearSheet({ variant = 'calendar', date, onTear, children }) {
  const [progress, setProgress] = useState(0);    // 0..1
  const [torn, setTorn] = useState(false);
  const [idleHint, setIdleHint] = useState(false);
  const startY = useRef(null);
  const sheetRef = useRef(null);

  // idle nudge — every 3.2s, briefly bend the page down so the user
  // sees it's draggable. Stops as soon as they grab it.
  useEffect(() => {
    if (torn) return;
    const id = setInterval(() => {
      if (startY.current != null) return;
      setIdleHint(true);
      setTimeout(() => setIdleHint(false), 700);
    }, 3200);
    return () => clearInterval(id);
  }, [torn]);

  const handleStart = (clientY) => { startY.current = clientY; setIdleHint(false); };
  const handleMove = (clientY) => {
    if (startY.current == null) return;
    const dy = Math.max(0, clientY - startY.current);
    setProgress(Math.min(1, dy / 180));
  };
  const handleEnd = () => {
    if (progress > 0.55) {
      setTorn(true);
      setTimeout(() => onTear?.(), 650);
    } else {
      setProgress(0);
    }
    startY.current = null;
  };

  const idleOffset = idleHint ? 14 : 0;
  const idleRot    = idleHint ? 2.5 : 0;

  // common: top sheet rotates and falls away
  return (
    <div ref={sheetRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* the page underneath (today's content) */}
      <div style={{ position: 'absolute', inset: 0 }}>{children}</div>

      {/* the cover sheet */}
      <div
        onMouseDown={(e) => handleStart(e.clientY)}
        onMouseMove={(e) => handleMove(e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientY)}
        onTouchEnd={handleEnd}
        style={{
          position: 'absolute', inset: 0,
          transformOrigin: '50% 0%',
          transform: torn
            ? `translateY(120%) rotate(-14deg)`
            : `translateY(${progress * 30 + idleOffset}px) rotate(${progress * 6 + idleRot}deg)`,
          opacity: torn ? 0 : 1,
          transition: torn
            ? 'transform .85s cubic-bezier(.4,0,.2,1), opacity .6s ease .25s'
            : startY.current == null ? 'transform .55s cubic-bezier(.4,1.4,.6,1)' : 'none',
          cursor: 'grab',
          zIndex: 5,
        }}>
        {variant === 'calendar' && <CalendarSheet date={date} progress={progress}/>}
        {variant === 'sticky'   && <StickySheet date={date} progress={progress}/>}
        {variant === 'envelope' && <EnvelopeSheet date={date} progress={progress}/>}
      </div>
    </div>
  );
}

function CalendarSheet({ date, progress }) {
  return (
    <div className="paper" style={{
      width: '100%', height: '100%', position: 'relative',
      borderTopLeftRadius: 28, borderTopRightRadius: 28,
      boxShadow: '0 10px 30px rgba(45,40,32,0.18), 0 1px 0 rgba(255,255,255,0.6) inset',
      overflow: 'hidden',
    }}>
      {/* binder ring holes */}
      <div style={{
        position: 'absolute', top: 14, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-around', padding: '0 24px',
      }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} style={{
            width: 10, height: 10, borderRadius: '50%',
            background: 'rgba(0,0,0,0.18)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
          }}/>
        ))}
      </div>
      {/* perforation line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 38, height: 1,
        backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.2) 50%, transparent 50%)',
        backgroundSize: '6px 1px',
      }}/>
      {/* date */}
      <div style={{
        position: 'absolute', inset: '60px 0 0 0',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 4,
          textTransform: 'uppercase', color: 'var(--tone-ink-soft)',
        }}>{date.weekday}</div>
        <div style={{
          fontFamily: 'var(--display)', fontWeight: 300, fontSize: 156,
          lineHeight: 1, color: 'var(--tone-ink)', fontStyle: 'italic',
        }}>{date.day}</div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: 3,
          textTransform: 'uppercase', color: 'var(--tone-ink-soft)',
        }}>{date.month} · {date.year}</div>
      </div>
      {/* prompt at bottom */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 60,
        textAlign: 'center', padding: '0 32px',
      }}>
        <div style={{
          fontFamily: 'var(--display)', fontStyle: 'italic',
          fontSize: 22, lineHeight: 1.3, color: 'var(--tone-ink)',
          opacity: 0.92,
        }}>three good things,<br/>before they fade.</div>
        <div style={{
          marginTop: 22,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 14px', borderRadius: 99,
          background: 'rgba(45,40,32,0.06)',
          fontFamily: 'var(--mono)', fontSize: 10,
          letterSpacing: 3, textTransform: 'uppercase',
          color: 'var(--tone-ink)',
          opacity: progress > 0.1 ? 0.4 : 1,
          transition: 'opacity .2s',
          animation: progress > 0.1 ? 'none' : 'hint-pulse 1.6s ease-in-out infinite',
        }}>
          <span style={{ fontSize: 14 }}>☟</span>
          drag down to tear
        </div>
      </div>
      {/* progress shadow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        boxShadow: `inset 0 -${20 + progress*40}px 30px -10px rgba(0,0,0,${0.04 + progress*0.05})`,
      }}/>
    </div>
  );
}

function StickySheet({ date, progress }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #fff5b8 0%, #ffe98a 100%)',
      position: 'relative',
      boxShadow: `0 ${12 + progress*20}px 30px rgba(45,40,32,0.22)`,
      transform: 'rotate(-1.5deg)',
    }}>
      {/* tape */}
      <div style={{
        position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%) rotate(-3deg)',
        width: 100, height: 28,
        background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(4px)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }}/>
      <div style={{ padding: '60px 36px', height: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 3, color: '#7a5a1a', textTransform: 'uppercase' }}>
          {date.weekday}, {date.month} {date.day}
        </div>
        <div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 56, lineHeight: 0.95, color: '#3a2a10' }}>
          today,<br/>
          three<br/>
          <span style={{ borderBottom: '3px solid #c46a3a' }}>good</span><br/>
          things.
        </div>
        <div style={{ marginTop: 'auto', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 4, color: '#7a5a1a', textTransform: 'uppercase' }}>
          ↓ peel to begin
        </div>
      </div>
    </div>
  );
}

function EnvelopeSheet({ date, progress }) {
  return (
    <div className="paper" style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: 'var(--tone-paper)',
      boxShadow: 'inset 0 0 80px rgba(45,40,32,0.06)',
    }}>
      {/* envelope flap (triangle) */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
        background: 'linear-gradient(180deg, var(--tone-paper) 0%, rgba(0,0,0,0.04) 100%)',
        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
      }}/>
      {/* wax seal */}
      <div style={{
        position: 'absolute', top: '46%', left: '50%',
        transform: `translate(-50%, -50%) scale(${1 - progress*0.2})`,
        width: 90, height: 90, borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%, #d8493a, #8a1f17 70%)',
        boxShadow: '0 6px 14px rgba(138,31,23,0.4), inset -4px -6px 10px rgba(0,0,0,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--display)', fontStyle: 'italic',
        color: 'rgba(255,240,220,0.85)', fontSize: 36,
        animation: 'seal-pulse 3s ease-in-out infinite',
      }}>好</div>
      {/* address line */}
      <div style={{
        position: 'absolute', bottom: 60, left: 0, right: 0, textAlign: 'center', padding: '0 40px',
      }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 4, color: 'var(--tone-ink-soft)', textTransform: 'uppercase' }}>
          to: you · {date.month} {date.day}
        </div>
        <div style={{ marginTop: 8, fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 18, color: 'var(--tone-ink)' }}>
          three good things, sealed inside
        </div>
        <div style={{ marginTop: 16, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 4, color: 'var(--tone-ink-soft)', textTransform: 'uppercase' }}>
          ↓ pull to break seal
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Particles, ParallaxScene, ParallaxLayer, WatercolorScene, TearSheet,
});
