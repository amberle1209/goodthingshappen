"use client";

import { useEffect, useMemo, useState } from "react";

const emailTo = "hello@example.com";

const pains = [
  "Clients send files in five places and nobody knows what is missing.",
  "Month-end gets blocked by one unpaid invoice, one bank statement, one receipt.",
  "Bookkeepers spend too much time chasing docs instead of closing books.",
];

const workflow = [
  {
    step: "1",
    title: "Collect",
    text: "One intake link gathers the same missing-item checklist every time.",
  },
  {
    step: "2",
    title: "Normalize",
    text: "Files get sorted into a clean client packet with obvious gaps called out.",
  },
  {
    step: "3",
    title: "Close",
    text: "Your team gets a ready-to-work bundle, so month-end moves instead of stalls.",
  },
];

const serviceLines = [
  "Client intake cleanup for bookkeeping firms",
  "Missing document chase-up templates",
  "Weekly follow-up and status reporting",
  "Lightweight setup, no long onboarding",
];

export default function BookkeepingIntakePage() {
  const [name, setName] = useState("");
  const [firm, setFirm] = useState("");
  const [volume, setVolume] = useState("10-25");
  const [pain, setPain] = useState("missing documents");
  const [status, setStatus] = useState("Ready when you are.");

  useEffect(() => {
    document.title = "Bookkeeping Intake Cleanup";
  }, []);

  const message = useMemo(() => {
    return [
      "Hi,",
      "",
      `I'm ${name || "[your name]"} from ${firm || "[your firm]"}.`,
      `We handle around ${volume} client packets per month.`,
      `The biggest pain is ${pain}.`,
      "",
      "Please send details for a bookkeeping intake cleanup pilot.",
    ].join("\n");
  }, [firm, name, pain, volume]);

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setStatus("Copied the intake note to your clipboard.");
    } catch {
      setStatus("Clipboard blocked. Use the mail link instead.");
    }
  }

  const mailtoHref = `mailto:${emailTo}?subject=${encodeURIComponent(
    "Bookkeeping intake cleanup pilot"
  )}&body=${encodeURIComponent(message)}`;

  return (
    <main style={styles.page}>
      <div style={styles.glowA} />
      <div style={styles.glowB} />

      <section style={styles.shell}>
        <div style={styles.heroGrid}>
          <div style={styles.heroCopy}>
            <div style={styles.kicker}>Bookkeeping operations wedge</div>
            <h1 style={styles.title}>
              Stop chasing client documents.
              <span style={styles.titleAccent}> Clean the intake.</span>
            </h1>
            <p style={styles.subhead}>
              A narrow service for bookkeeping firms that keeps month-end moving by
              turning messy client uploads into a tidy, trackable packet.
            </p>

            <div style={styles.pillRow}>
              <span style={styles.pill}>Missing docs</span>
              <span style={styles.pill}>Cleanup</span>
              <span style={styles.pill}>Follow-up</span>
              <span style={styles.pill}>Close faster</span>
            </div>

            <div style={styles.ctaRow}>
              <a href={mailtoHref} style={styles.primaryCta}>
                Open email draft
              </a>
              <button onClick={copyMessage} style={styles.secondaryCta}>
                Copy message
              </button>
            </div>

            <p style={styles.status}>{status}</p>
          </div>

          <aside style={styles.card}>
            <div style={styles.cardLabel}>What the service does</div>
            <ul style={styles.list}>
              {serviceLines.map((line) => (
                <li key={line} style={styles.listItem}>
                  <span style={styles.bullet} />
                  {line}
                </li>
              ))}
            </ul>
            <div style={styles.priceBox}>
              <div style={styles.priceTag}>Pilot offer</div>
              <div style={styles.price}>$250 setup + $500 / month</div>
              <p style={styles.priceCopy}>
                Lightweight, founder-led delivery for the first three firms. No
                custom software required.
              </p>
            </div>
          </aside>
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Why it matters</h2>
          <div style={styles.grid3}>
            {pains.map((item) => (
              <div key={item} style={styles.infoCard}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Workflow</h2>
          <div style={styles.grid3}>
            {workflow.map((item) => (
              <div key={item.step} style={styles.stepCard}>
                <div style={styles.stepNum}>{item.step}</div>
                <div style={styles.stepTitle}>{item.title}</div>
                <p style={styles.stepText}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Pilot intake</h2>
          <div style={styles.formGrid}>
            <label style={styles.label}>
              Your name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                style={styles.input}
                placeholder="Amber"
              />
            </label>
            <label style={styles.label}>
              Firm
              <input
                value={firm}
                onChange={(event) => setFirm(event.target.value)}
                style={styles.input}
                placeholder="North Shore Bookkeeping"
              />
            </label>
            <label style={styles.label}>
              Monthly volume
              <select
                value={volume}
                onChange={(event) => setVolume(event.target.value)}
                style={styles.input}
              >
                <option>1-10</option>
                <option>10-25</option>
                <option>25-50</option>
                <option>50+</option>
              </select>
            </label>
            <label style={styles.label}>
              Main pain point
              <input
                value={pain}
                onChange={(event) => setPain(event.target.value)}
                style={styles.input}
                placeholder="missing documents"
              />
            </label>
          </div>

          <div style={styles.noteBox}>
            <pre style={styles.message}>{message}</pre>
          </div>
        </section>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100dvh",
    background:
      "radial-gradient(circle at top left, rgba(255, 244, 217, 0.92), transparent 38%), linear-gradient(135deg, #171219 0%, #20171a 45%, #f2e1bf 45%, #f8f2e6 100%)",
    color: "#171219",
    position: "relative",
    overflow: "hidden",
  },
  glowA: {
    position: "absolute",
    inset: "8% auto auto 12%",
    width: 340,
    height: 340,
    borderRadius: "999px",
    background: "rgba(255, 188, 114, 0.22)",
    filter: "blur(12px)",
  },
  glowB: {
    position: "absolute",
    right: "-120px",
    top: "42%",
    width: 420,
    height: 420,
    borderRadius: "999px",
    background: "rgba(141, 111, 89, 0.18)",
    filter: "blur(10px)",
  },
  shell: {
    position: "relative",
    maxWidth: 1180,
    margin: "0 auto",
    padding: "48px 24px 72px",
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 28,
    alignItems: "stretch",
  },
  heroCopy: {
    padding: "20px 4px 8px",
  },
  kicker: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 14px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.75)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    fontSize: 13,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: 18,
  },
  title: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "clamp(3rem, 7vw, 5.8rem)",
    lineHeight: 0.93,
    letterSpacing: "-0.04em",
    color: "#f8f2e6",
    margin: 0,
    maxWidth: 860,
  },
  titleAccent: {
    display: "block",
    color: "#ffbf6b",
  },
  subhead: {
    marginTop: 22,
    maxWidth: 640,
    color: "rgba(248, 242, 230, 0.88)",
    fontSize: 18,
    lineHeight: 1.65,
  },
  pillRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 24,
  },
  pill: {
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    color: "#f8f2e6",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(10px)",
    fontSize: 14,
  },
  ctaRow: {
    display: "flex",
    gap: 14,
    flexWrap: "wrap",
    marginTop: 30,
  },
  primaryCta: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 20px",
    borderRadius: 999,
    background: "#ffbf6b",
    color: "#171219",
    textDecoration: "none",
    fontWeight: 700,
    boxShadow: "0 16px 30px rgba(0,0,0,0.14)",
  },
  secondaryCta: {
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "#f8f2e6",
    borderRadius: 999,
    padding: "14px 20px",
    fontWeight: 600,
    cursor: "pointer",
  },
  status: {
    marginTop: 14,
    color: "rgba(248, 242, 230, 0.72)",
    fontSize: 14,
  },
  card: {
    background: "rgba(255,255,255,0.74)",
    border: "1px solid rgba(255,255,255,0.6)",
    borderRadius: 28,
    padding: 24,
    boxShadow: "0 26px 70px rgba(19, 11, 10, 0.18)",
    backdropFilter: "blur(18px)",
  },
  cardLabel: {
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    fontSize: 12,
    color: "#8b6a58",
    marginBottom: 16,
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "grid",
    gap: 14,
  },
  listItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    lineHeight: 1.5,
    fontSize: 15,
  },
  bullet: {
    width: 10,
    height: 10,
    marginTop: 6,
    borderRadius: "999px",
    background: "linear-gradient(135deg, #9a5d3d, #ffbf6b)",
    flex: "0 0 auto",
  },
  priceBox: {
    marginTop: 22,
    padding: 18,
    borderRadius: 22,
    background: "linear-gradient(160deg, rgba(255,191,107,0.25), rgba(255,255,255,0.5))",
    border: "1px solid rgba(117, 83, 45, 0.1)",
  },
  priceTag: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    color: "#8b6a58",
    marginBottom: 8,
  },
  price: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: 28,
    lineHeight: 1.1,
    fontWeight: 700,
    color: "#1b1316",
  },
  priceCopy: {
    margin: "10px 0 0",
    color: "#4d3b31",
    lineHeight: 1.55,
    fontSize: 14,
  },
  section: {
    marginTop: 34,
  },
  sectionTitle: {
    margin: "0 0 16px",
    color: "#f8f2e6",
    fontSize: 22,
    letterSpacing: "-0.02em",
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },
  infoCard: {
    borderRadius: 22,
    padding: 20,
    background: "rgba(255,255,255,0.08)",
    color: "#f8f2e6",
    border: "1px solid rgba(255,255,255,0.08)",
    lineHeight: 1.6,
  },
  stepCard: {
    borderRadius: 22,
    padding: 20,
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(41, 28, 25, 0.08)",
    boxShadow: "0 18px 42px rgba(19, 11, 10, 0.08)",
  },
  stepNum: {
    display: "inline-flex",
    width: 36,
    height: 36,
    borderRadius: "999px",
    alignItems: "center",
    justifyContent: "center",
    background: "#171219",
    color: "#ffbf6b",
    fontWeight: 700,
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 8,
  },
  stepText: {
    margin: 0,
    color: "#4d3b31",
    lineHeight: 1.6,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },
  label: {
    display: "grid",
    gap: 8,
    color: "#f8f2e6",
    fontSize: 14,
  },
  input: {
    width: "100%",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.08)",
    color: "#f8f2e6",
    padding: "14px 16px",
    outline: "none",
  },
  noteBox: {
    marginTop: 18,
    padding: 18,
    borderRadius: 24,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  message: {
    margin: 0,
    whiteSpace: "pre-wrap",
    color: "#f8f2e6",
    lineHeight: 1.6,
    fontSize: 14,
    overflowX: "auto",
  },
};
