import { loadResultsData, computeGlobalStats, getAllTopics } from "@/lib/data";
import Navbar from "./components/Navbar";
import ProblemList from "./components/ProblemList";

export const metadata = {
  title: "DSA Lab",
  description: "Personal competitive programming solutions archive.",
};

export default function HomePage() {
  const data = loadResultsData();
  const stats = computeGlobalStats(data);
  const topics = getAllTopics(data);

  return (
    <>
      <Navbar />
      <main>
        {/* ─── HERO SECTION ─── */}
        <section style={styles.hero}>
          <div className="container">
            <div style={styles.heroInner}>
              <div style={styles.heroText}>
                <p style={styles.heroLabel}>SOLUTIONS ARCHIVE</p>
                <h1 style={styles.heroTitle}>
                  {stats.total} Problems
                  <br />
                  Solved.
                </h1>
              </div>

              {/* ─── STAT BLOCKS ─── */}
              <div style={styles.statsRow} className="stagger">
                <div className="stat-block">
                  <span className="stat-block__value">{stats.total}</span>
                  <span className="stat-block__label">TOTAL SOLVED</span>
                </div>
                <div className="stat-block">
                  <span className="stat-block__value" style={{ color: "var(--accent-success)" }}>
                    {stats.byDifficulty.Easy}
                  </span>
                  <span className="stat-block__label">EASY</span>
                </div>
                <div className="stat-block">
                  <span className="stat-block__value" style={{ color: "var(--accent-warning)" }}>
                    {stats.byDifficulty.Medium}
                  </span>
                  <span className="stat-block__label">MEDIUM</span>
                </div>
                <div className="stat-block">
                  <span className="stat-block__value" style={{ color: "var(--accent-danger)" }}>
                    {stats.byDifficulty.Hard}
                  </span>
                  <span className="stat-block__label">HARD</span>
                </div>
                <div className="stat-block">
                  <span className="stat-block__value">{stats.passRate}%</span>
                  <span className="stat-block__label">PASS RATE</span>
                </div>
                <div className="stat-block">
                  <span className="stat-block__value">{stats.totalRuntime.toFixed(1)}</span>
                  <span className="stat-block__label">TOTAL MS</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ─── PROBLEM LIST ─── */}
        <section style={styles.listSection}>
          <div className="container">
            <ProblemList problems={data} topics={topics} />
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer style={styles.footer}>
        <div className="container" style={styles.footerInner}>
          <span style={styles.footerText}>DSA LAB — BUILT WITH C++ / GTEST / NEXT.JS</span>
          <span style={styles.footerText}>{stats.totalTests} TEST CASES TRACKED</span>
        </div>
      </footer>
    </>
  );
}

const styles = {
  hero: {
    padding: "64px 0 48px",
    borderBottom: "none",
  },
  heroInner: {
    display: "flex",
    flexDirection: "column",
    gap: 40,
  },
  heroText: {
    maxWidth: 700,
  },
  heroLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.2em",
    color: "var(--accent-primary)",
    marginBottom: 12,
  },
  heroTitle: {
    fontFamily: "var(--font-sans)",
    fontWeight: 900,
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
    lineHeight: 1.0,
    letterSpacing: "-0.04em",
    marginBottom: 16,
  },
  heroSub: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.85rem",
    color: "var(--text-tertiary)",
    letterSpacing: "0.02em",
    lineHeight: 1.5,
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 12,
  },
  listSection: {
    padding: "40px 0 80px",
  },
  footer: {
    borderTop: "var(--border)",
    padding: "20px 0",
  },
  footerInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  footerText: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.6rem",
    fontWeight: 600,
    letterSpacing: "0.15em",
    color: "var(--text-tertiary)",
  },
};
