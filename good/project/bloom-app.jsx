// bloom-app.jsx — flow controller using new sequence
const TODAY = (() => {
  const d = new Date('2026-05-06');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const days   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return {
    weekday: days[d.getDay()],
    day: d.getDate(),
    month: months[d.getMonth()],
    year: d.getFullYear(),
  };
})();

function NewRevealScreen({ entries, mood, date, palette, onShare, onBack }) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { const t = setTimeout(() => setRevealed(true), 280); return () => clearTimeout(t); }, []);

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: `radial-gradient(ellipse at top, ${palette[2]}33 0%, var(--tone-paper) 60%)`,
      display: 'flex', flexDirection: 'column', paddingTop: 48,
    }}>
      {/* slim chrome */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '4px 18px 0',
      }}>
        <GhostBtn onClick={onBack}>← edit</GhostBtn>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--tone-ink-soft)' }}>
          № 001 · {date.month} {date.day}
        </span>
        <span style={{ width: 36 }}/>
      </div>

      {/* card dominates */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 14px 0' }}>
        <DioramaCard entries={entries} mood={mood} date={date} palette={palette} revealed={revealed}/>
      </div>

      {/* compact footer: small share row + tilt hint */}
      <div style={{
        padding: '14px 22px 22px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          flex: 1, fontFamily: 'var(--mono)', fontSize: 9,
          letterSpacing: 2, textTransform: 'uppercase',
          color: 'var(--tone-ink-soft)', lineHeight: 1.5,
        }}>
          tilt cursor over the scene<br/>to peek inside
        </div>
        <button onClick={onShare} style={{
          height: 40, padding: '0 18px', borderRadius: 20,
          border: 'none', background: 'var(--tone-ink)',
          color: 'var(--tone-paper)', cursor: 'pointer',
          fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 15,
          boxShadow: '0 6px 18px rgba(45,40,32,0.18)',
        }}>share →</button>
      </div>
    </div>
  );
}

function BloomFlow({ tone, particleIntensity }) {
  const palette = TONE_PALETTES[tone] || TONE_PALETTES.dawn;
  // 0 welcome → 1/2/3 good things → 4 mood → 5 tear+loading → 6 reveal → 7 share
  const [step, setStep] = useState(0);
  const [entries, setEntries] = useState(['', '', '']);
  const [mood, setMood] = useState('');

  const setEntry = (i, v) => setEntries((es) => es.map((e, j) => (j === i ? v : e)));
  const reset = () => { setEntries(['', '', '']); setMood(''); setStep(0); };

  return (
    <div data-tone={tone} style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: 'var(--tone-bg)',
    }}>
      {step === 0 && <WelcomeScreen onBegin={() => setStep(1)} date={TODAY}/>}

      {step >= 1 && step <= 3 && (
        <GoodThingScreen
          key={step}
          index={step - 1}
          value={entries[step - 1]}
          onChange={(v) => setEntry(step - 1, v)}
          onNext={() => setStep(step + 1)}
          onBack={() => setStep(step - 1)}
          palette={palette}
          particleIntensity={particleIntensity}
        />
      )}

      {step === 4 && (
        <MoodScreen
          value={mood}
          onChange={setMood}
          onNext={() => setStep(5)}
          onBack={() => setStep(3)}
          palette={palette}
        />
      )}

      {step === 5 && (
        <TearAwayLoading
          entries={entries} mood={mood} date={TODAY} palette={palette}
          onDone={() => setStep(6)}
        />
      )}

      {step === 6 && (
        <NewRevealScreen
          entries={entries} mood={mood} date={TODAY} palette={palette}
          onShare={() => setStep(7)}
          onBack={() => setStep(4)}
        />
      )}

      {step === 7 && (
        <ShareScreen onBack={() => setStep(6)} palette={palette} date={TODAY}/>
      )}

      {step >= 6 && (
        <button onClick={reset} style={{
          position: 'absolute', top: 18, right: 18, zIndex: 99,
          background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)',
          border: '1px solid var(--tone-rule)', borderRadius: 99,
          padding: '4px 10px', cursor: 'pointer',
          fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 2,
          textTransform: 'uppercase', color: 'var(--tone-ink-soft)',
        }}>↻ start over</button>
      )}
    </div>
  );
}

function BloomPhone({ tone, particleIntensity, width = 380, height = 820 }) {
  return (
    <IOSDevice width={width} height={height} dark={false}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <BloomFlow tone={tone} particleIntensity={particleIntensity}/>
      </div>
    </IOSDevice>
  );
}

Object.assign(window, { BloomFlow, BloomPhone, TODAY, NewRevealScreen });
