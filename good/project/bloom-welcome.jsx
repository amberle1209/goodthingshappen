// bloom-welcome.jsx — soft entry screen (no tear here anymore)
const { useState: useStateW, useEffect: useEffectW } = React;

function WelcomeScreen({ onBegin, date }) {
  const [breath, setBreath] = useStateW(0);
  useEffectW(() => {
    const id = setInterval(() => setBreath((b) => b + 1), 60);
    return () => clearInterval(id);
  }, []);
  const t = (breath % 200) / 200;
  const wave = Math.sin(t * Math.PI * 2);

  return (
    <div className="paper-soft" style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      paddingTop: 56, display: 'flex', flexDirection: 'column',
    }}>
      {/* date eyebrow */}
      <div style={{ padding: '24px 32px 0' }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 4,
          textTransform: 'uppercase', color: 'var(--tone-ink-soft)',
        }}>{date.weekday} · {date.month} {date.day}, {date.year}</div>
      </div>

      {/* breathing dot */}
      <div style={{
        margin: '40px auto 0', width: 100, height: 100,
        position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'var(--tone-accent)', opacity: 0.12,
          transform: `scale(${1 + wave * 0.25})`,
          transition: 'transform .06s linear',
        }}/>
        <span style={{
          position: 'absolute', inset: 18, borderRadius: '50%',
          background: 'var(--tone-leaf)', opacity: 0.18,
          transform: `scale(${1 + wave * 0.15})`,
          transition: 'transform .06s linear',
        }}/>
        <span style={{
          width: 14, height: 14, borderRadius: '50%',
          background: 'var(--tone-ink)',
        }}/>
      </div>

      {/* headline */}
      <div style={{ padding: '40px 36px 0', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--display)', fontSize: 38, lineHeight: 1.1,
          color: 'var(--tone-ink)', fontWeight: 400,
        }}>
          three good <em style={{ fontStyle: 'italic', color: 'var(--tone-accent)' }}>things</em><br/>
          before they fade.
        </div>
        <div style={{
          marginTop: 20, fontFamily: 'var(--display)', fontStyle: 'italic',
          fontSize: 17, color: 'var(--tone-ink-soft)', lineHeight: 1.5,
        }}>
          write them down and watch<br/>today turn into a tiny landscape.
        </div>
      </div>

      <div style={{ marginTop: 'auto', padding: '0 24px 28px' }}>
        <PrimaryBtn onClick={onBegin}>begin →</PrimaryBtn>
        <div style={{
          marginTop: 14, textAlign: 'center', fontFamily: 'var(--mono)',
          fontSize: 9, letterSpacing: 3, textTransform: 'uppercase',
          color: 'var(--tone-ink-soft)', opacity: 0.6,
        }}>under 60 seconds · no streaks · no guilt</div>
      </div>
    </div>
  );
}

Object.assign(window, { WelcomeScreen });
