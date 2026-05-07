// bloom-screens.jsx — the seven step screens for the input flow
// Owns: Welcome (TearSheet), GoodThing (1/2/3), MoodPicker, Loading, Reveal, Share

const TONE_PALETTES = {
  ghibli: ['#c46a3a', '#6e8b5a', '#7aa3c6', '#e3b659'],   // accent, leaf, sky, sun
  washi:  ['#b03a2e', '#7d6a36', '#a89466', '#d8a548'],
  dawn:   ['#5b7c8a', '#889a7a', '#bfc8cf', '#d6c7a3'],
};

/* small UI bits ─────────────────────────────────────── */
function StepDots({ step, total = 7 }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={{
          width: i === step ? 18 : 6, height: 6, borderRadius: 3,
          background: i <= step ? 'var(--tone-ink)' : 'var(--tone-rule)',
          opacity: i <= step ? 0.85 : 1,
          transition: 'all .3s cubic-bezier(.2,.7,.3,1)',
        }}/>
      ))}
    </div>
  );
}

function PrimaryBtn({ children, onClick, disabled, style }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', height: 52, border: 'none', borderRadius: 26,
      background: disabled ? 'rgba(45,40,32,0.12)' : 'var(--tone-ink)',
      color: disabled ? 'var(--tone-ink-soft)' : 'var(--tone-paper)',
      fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 18,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all .25s', letterSpacing: 0.2,
      boxShadow: disabled ? 'none' : '0 8px 22px rgba(45,40,32,0.18)',
      ...style,
    }}>{children}</button>
  );
}

function GhostBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'transparent', border: 'none',
      fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 2,
      color: 'var(--tone-ink-soft)', textTransform: 'uppercase',
      cursor: 'pointer', padding: 8,
    }}>{children}</button>
  );
}

/* ─────────────────────────────────────────────────────────
   Screen: GoodThing — inline editor with prompt + particles
   ───────────────────────────────────────────────────────── */
const PROMPTS = [
  ['the smallest thing', 'a stranger\'s face', 'a sound you noticed', 'something warm', 'a tiny win'],
  ['who saw you today', 'a passing moment', 'something tasted', 'a soft sentence', 'a color outside'],
  ['the slowest minute', 'something that grew', 'an old song', 'a kept promise', 'a tiny relief'],
];

const ENCOURAGEMENTS = [
  'good. keep going.', 'I see it.', 'mm — that one.',
  'tender.', 'okay, that\'s real.', 'yes.',
];

function GoodThingScreen({ index, value, onChange, onNext, palette, particleIntensity, onBack }) {
  const [keyTick, setKeyTick] = useState(0);
  const [prompt, setPrompt] = useState(() =>
    PROMPTS[index][Math.floor(Math.random() * PROMPTS[index].length)]
  );
  const [encouragement, setEncouragement] = useState('');
  const taRef = useRef(null);

  useEffect(() => { taRef.current?.focus(); }, []);

  // surface a quiet AI-style encouragement once they've written something real
  useEffect(() => {
    const len = value.trim().length;
    if (len > 14 && !encouragement) {
      setEncouragement(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]);
    }
    if (len < 8 && encouragement) setEncouragement('');
  }, [value]);

  const ordinal = ['first', 'second', 'third'][index];
  const dotColor = palette[index === 0 ? 0 : index === 1 ? 1 : 3];

  return (
    <div className="paper-soft" style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      paddingTop: 56,
    }}>
      {/* top: back + step dots */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '4px 24px 0',
      }}>
        <GhostBtn onClick={onBack}>← back</GhostBtn>
        <StepDots step={1 + index} />
        <span style={{ width: 50 }}/>
      </div>

      {/* eyebrow */}
      <div style={{ padding: '24px 32px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: dotColor, boxShadow: `0 0 0 4px ${dotColor}22` }}/>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--tone-ink-soft)' }}>
          good thing #{index + 1} of three · {ordinal}
        </span>
      </div>

      {/* prompt */}
      <div style={{ padding: '14px 32px 4px' }}>
        <div style={{
          fontFamily: 'var(--display)', fontSize: 32, lineHeight: 1.15,
          color: 'var(--tone-ink)', fontWeight: 400,
        }}>
          tell me about <em style={{ color: dotColor, fontStyle: 'italic' }}>{prompt}</em>.
        </div>
      </div>

      {/* the input */}
      <div style={{
        position: 'relative', margin: '20px 24px 0', flex: 1,
        background: 'var(--tone-paper)',
        borderRadius: 18, border: '1px solid var(--tone-rule)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 14px rgba(45,40,32,0.05)',
        padding: 20, overflow: 'visible',
      }}>
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => { onChange(e.target.value); setKeyTick((t) => t + 1); }}
          placeholder="start anywhere. the small stuff counts."
          style={{
            width: '100%', height: '100%',
            border: 'none', outline: 'none', resize: 'none', background: 'transparent',
            fontFamily: 'var(--body)', fontSize: 19, lineHeight: 1.5,
            color: 'var(--tone-ink)',
          }}
        />
        <Particles trigger={keyTick} intensity={particleIntensity} palette={palette}/>

        {/* encouragement bubble */}
        <div style={{
          position: 'absolute', right: 16, bottom: 12,
          fontFamily: 'var(--display)', fontStyle: 'italic',
          fontSize: 14, color: dotColor,
          opacity: encouragement ? 0.85 : 0,
          transform: encouragement ? 'translateY(0)' : 'translateY(6px)',
          transition: 'all .4s cubic-bezier(.2,.7,.3,1)',
        }}>
          {encouragement || '·'}
        </div>
      </div>

      {/* footer */}
      <div style={{ padding: '18px 24px 28px' }}>
        <PrimaryBtn onClick={onNext} disabled={value.trim().length < 3}>
          {value.trim().length < 3 ? 'a few words…' : index < 2 ? 'next good thing →' : 'last step →'}
        </PrimaryBtn>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Screen: Mood — choose one, with watercolor preview
   ───────────────────────────────────────────────────────── */
const MOODS = [
  { id: 'calm',     label: 'calm',     symbol: '○', tint: 0 },
  { id: 'tender',   label: 'tender',   symbol: '◐', tint: 1 },
  { id: 'bright',   label: 'bright',   symbol: '☀', tint: 3 },
  { id: 'wistful',  label: 'wistful',  symbol: '◌', tint: 2 },
  { id: 'grateful', label: 'grateful', symbol: '♡', tint: 0 },
  { id: 'tired',    label: 'tired',    symbol: '◦', tint: 2 },
];

function MoodScreen({ value, onChange, onNext, onBack, palette }) {
  return (
    <div className="paper-soft" style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', paddingTop: 56,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '4px 24px 0',
      }}>
        <GhostBtn onClick={onBack}>← back</GhostBtn>
        <StepDots step={4} />
        <span style={{ width: 50 }}/>
      </div>

      <div style={{ padding: '28px 32px 0' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--tone-ink-soft)' }}>
          one last thing
        </div>
        <div style={{ fontFamily: 'var(--display)', fontSize: 32, lineHeight: 1.15, marginTop: 8 }}>
          today felt mostly… <em style={{ color: 'var(--tone-accent)' }}>{value || '?'}</em>
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: 12, padding: '24px 24px 0',
      }}>
        {MOODS.map((m) => {
          const active = value === m.id;
          return (
            <button key={m.id} onClick={() => onChange(m.id)}
              style={{
                aspectRatio: '1 / 1', borderRadius: 22,
                border: active ? `1.5px solid var(--tone-ink)` : '1px solid var(--tone-rule)',
                background: active ? 'var(--tone-paper)' : 'rgba(255,255,255,0.4)',
                boxShadow: active
                  ? '0 8px 22px rgba(45,40,32,0.14), inset 0 1px 0 rgba(255,255,255,0.7)'
                  : '0 1px 0 rgba(255,255,255,0.6) inset',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                cursor: 'pointer', transition: 'all .25s',
                transform: active ? 'translateY(-2px)' : 'none',
              }}>
              <span style={{
                fontSize: 28, color: palette[m.tint],
                filter: active ? 'none' : 'grayscale(0.3)',
              }}>{m.symbol}</span>
              <span style={{
                fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 16,
                color: 'var(--tone-ink)',
              }}>{m.label}</span>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 'auto', padding: '0 24px 28px' }}>
        <PrimaryBtn onClick={onNext} disabled={!value}>
          {value ? 'paint my day →' : 'pick one'}
        </PrimaryBtn>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Screen: Loading — AI brewing
   ───────────────────────────────────────────────────────── */
const LOAD_LINES = [
  'reading what you wrote…',
  'mixing pigments…',
  'placing three markers…',
  'letting the colors bloom…',
];

function LoadingScreen({ onDone, palette }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 2300);
    const t4 = setTimeout(() => onDone(), 3300);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);
  return (
    <div className="paper-soft" style={{
      width: '100%', height: '100%', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 24, padding: 32, position: 'relative', overflow: 'hidden',
    }}>
      {/* ink blooming */}
      <div style={{ position: 'relative', width: 160, height: 160 }}>
        {palette.slice(0, 3).map((c, i) => (
          <span key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: `translate(-50%,-50%) translate(${[0,-30,30][i]}px,${[-20,20,20][i]}px)`,
            width: 100, height: 100, borderRadius: '50%', background: c, opacity: 0.5,
            filter: 'blur(20px)',
            animation: `ink-bloom 1.8s ease-in-out ${i * 0.3}s infinite`,
          }}/>
        ))}
      </div>
      <div style={{ height: 28, position: 'relative', width: '100%', textAlign: 'center' }}>
        {LOAD_LINES.map((l, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 18,
            color: 'var(--tone-ink-soft)',
            opacity: phase === i ? 1 : 0,
            transform: `translateY(${phase === i ? 0 : 8}px)`,
            transition: 'all .4s cubic-bezier(.2,.7,.3,1)',
          }}>{l}</div>
        ))}
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--tone-ink-soft)', opacity: 0.5 }}>
        usually under 15 seconds
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Screen: Reveal — the calendar card with parallax
   ───────────────────────────────────────────────────────── */
function RevealScreen({ entries, mood, date, palette, onShare, onBack }) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { const t = setTimeout(() => setRevealed(true), 220); return () => clearTimeout(t); }, []);

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: `radial-gradient(ellipse at top, ${palette[2]}33 0%, var(--tone-paper) 60%)`,
      display: 'flex', flexDirection: 'column', paddingTop: 56,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '4px 24px 0',
      }}>
        <GhostBtn onClick={onBack}>← edit</GhostBtn>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--tone-ink-soft)' }}>
          your card · {date.month} {date.day}
        </span>
        <span style={{ width: 40 }}/>
      </div>

      {/* card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <ParallaxScene depth={1} style={{
          width: 280, height: 420,
          transform: revealed ? 'rotateY(0) rotateX(0) scale(1)' : 'rotateY(-25deg) rotateX(8deg) scale(0.9)',
          opacity: revealed ? 1 : 0,
          transition: 'all 1s cubic-bezier(.2,.7,.3,1)',
        }}>
          <ParallaxLayer depth={-2}>
            {/* deepest layer: paper card body */}
            <div className="paper" style={{
              width: '100%', height: '100%', borderRadius: 22,
              boxShadow: '0 30px 60px rgba(45,40,32,0.28), 0 0 0 1px rgba(45,40,32,0.06)',
              overflow: 'hidden', position: 'relative',
            }}>
              {/* watercolor scene */}
              <div style={{ position: 'absolute', top: 28, left: 0, right: 0, height: 200 }}>
                <WatercolorScene palette={palette} mood={mood}/>
              </div>
              {/* date stripe */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
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
              {/* three good things */}
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: 0, top: 240,
                padding: '14px 22px 22px',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                {entries.map((e, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{
                      flexShrink: 0, width: 8, height: 8, borderRadius: '50%',
                      background: palette[i === 2 ? 3 : i],
                      marginTop: 7,
                      boxShadow: `0 0 0 3px ${palette[i === 2 ? 3 : i]}33`,
                    }}/>
                    <span style={{
                      fontFamily: 'var(--display)', fontStyle: 'italic',
                      fontSize: 13, lineHeight: 1.35, color: 'var(--tone-ink)',
                    }}>{e || '—'}</span>
                  </div>
                ))}
                <div style={{
                  marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: 2, textTransform: 'uppercase',
                  color: 'var(--tone-ink-soft)',
                }}>
                  <span>mood · {mood}</span>
                  <span>good things happen</span>
                </div>
              </div>
            </div>
          </ParallaxLayer>

          {/* depth layer: a sun glint that floats above */}
          <ParallaxLayer depth={1}>
            <span style={{
              position: 'absolute', top: 60, right: 38,
              width: 24, height: 24, borderRadius: '50%',
              background: palette[3], opacity: 0.4, filter: 'blur(8px)',
            }}/>
          </ParallaxLayer>
          <ParallaxLayer depth={2}>
            <span style={{
              position: 'absolute', top: 18, left: 22,
              fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 3,
              color: 'var(--tone-ink-soft)', opacity: 0.4,
            }}>№ 001</span>
          </ParallaxLayer>
        </ParallaxScene>
      </div>

      <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <PrimaryBtn onClick={onShare}>share this card →</PrimaryBtn>
        <div style={{ textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--tone-ink-soft)', opacity: 0.6, marginTop: 4 }}>
          tilt the card · drag to peek inside
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Screen: Share — IG / X options + saved confirmation
   ───────────────────────────────────────────────────────── */
function ShareScreen({ onBack, palette, date }) {
  const [shared, setShared] = useState(null);
  const opts = [
    { id: 'ig-story', label: 'Instagram Story', sub: '9:16 portrait' },
    { id: 'ig-post',  label: 'Instagram Post',  sub: '1:1 square' },
    { id: 'x',        label: 'X / Twitter',     sub: 'image + caption' },
    { id: 'save',     label: 'save to camera roll', sub: 'PNG · 1080×1350' },
  ];
  return (
    <div className="paper-soft" style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      paddingTop: 56, overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '4px 24px 0',
      }}>
        <GhostBtn onClick={onBack}>← card</GhostBtn>
        <StepDots step={6} />
        <span style={{ width: 50 }}/>
      </div>

      <div style={{ padding: '28px 32px 0' }}>
        <div style={{ fontFamily: 'var(--display)', fontSize: 30, lineHeight: 1.15 }}>
          send today<br/>somewhere it can <em style={{ color: 'var(--tone-accent)' }}>land</em>.
        </div>
        <div style={{ marginTop: 8, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--tone-ink-soft)' }}>
          no caption pressure. the card speaks.
        </div>
      </div>

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {opts.map((o) => {
          const active = shared === o.id;
          return (
            <button key={o.id} onClick={() => setShared(o.id)} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 18px', borderRadius: 16,
              background: active ? 'var(--tone-ink)' : 'var(--tone-paper)',
              color: active ? 'var(--tone-paper)' : 'var(--tone-ink)',
              border: active ? 'none' : '1px solid var(--tone-rule)',
              cursor: 'pointer', transition: 'all .25s',
              boxShadow: active ? '0 8px 22px rgba(45,40,32,0.18)' : 'none',
              textAlign: 'left',
            }}>
              <span style={{
                width: 36, height: 36, borderRadius: 10,
                background: active ? 'rgba(255,255,255,0.15)' : palette[0] + '22',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: active ? 'var(--tone-paper)' : palette[0],
                fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 18,
              }}>{o.id === 'x' ? '✕' : o.id === 'save' ? '↓' : '○'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 18 }}>{o.label}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.6 }}>{o.sub}</div>
              </div>
              <span style={{ opacity: active ? 1 : 0.4 }}>{active ? '✓' : '→'}</span>
            </button>
          );
        })}
      </div>

      {shared && (
        <div style={{
          margin: '0 24px', padding: '14px 18px', borderRadius: 14,
          background: palette[1] + '1f', border: `1px solid ${palette[1]}55`,
          display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 15, color: 'var(--tone-ink)',
        }}>
          <span style={{ width: 18, height: 18, borderRadius: '50%', background: palette[1], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>✓</span>
          off it goes. {date.month} {date.day} card sent.
        </div>
      )}

      <div style={{ marginTop: 'auto', padding: '0 24px 28px' }}>
        <PrimaryBtn onClick={onBack}>done — back to card</PrimaryBtn>
      </div>
    </div>
  );
}

Object.assign(window, {
  GoodThingScreen, MoodScreen, LoadingScreen, RevealScreen, ShareScreen,
  StepDots, PrimaryBtn, GhostBtn, TONE_PALETTES,
});
