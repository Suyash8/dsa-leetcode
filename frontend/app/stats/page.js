import { loadResultsData, computeGlobalStats } from "@/lib/data";
import Navbar from "../components/Navbar";
import Link from "next/link";

export const metadata = {
  title: "Stats — DSA Lab",
  description: "Performance statistics.",
};

export default function StatsPage() {
  const data = loadResultsData();
  const stats = computeGlobalStats(data);

  // Compute per-problem performance for rankings
  const rankings = data
    .filter((p) => p.stats)
    .map((p) => ({
      id: p.id,
      number: p.number,
      title: p.title,
      difficulty: p.difficulty,
      totalRuntime: p.stats.total_runtime_ms,
      avgRuntime: p.stats.average_runtime_ms,
      memory: p.stats.total_memory_bytes,
      tests: p.stats.total_tests,
      passed: p.stats.passed_tests,
    }));

  const fastestByAvg = [...rankings].sort((a, b) => a.avgRuntime - b.avgRuntime);
  const mostTests = [...rankings].sort((a, b) => b.tests - a.tests);

  // Topic distribution
  const topicEntries = Object.entries(stats.topicCounts).sort((a, b) => b[1] - a[1]);
  const maxTopicCount = Math.max(...topicEntries.map(([, v]) => v), 1);

  return (
    <>
      <Navbar />
      <main>
        <section style={styles.header}>
          <div className="container">
            <div style={styles.breadcrumb}>
              <Link href="/" style={styles.breadcrumbLink}>INDEX</Link>
              <span style={styles.breadcrumbSep}>/</span>
              <span style={styles.breadcrumbCurrent}>STATS</span>
            </div>
            <h1 style={styles.title}>Performance<br />Overview.</h1>
            <p style={styles.sub}>
              Aggregate metrics across {stats.total} solved problems and{" "}
              {stats.totalTests} test cases.
            </p>
          </div>
        </section>

        <hr className="divider" />

        <section style={styles.content}>
          <div className="container">
            {/* ─── OVERVIEW STATS ─── */}
            <div style={styles.statsGrid} className="stagger">
              <div className="stat-block">
                <span className="stat-block__value">{stats.total}</span>
                <span className="stat-block__label">PROBLEMS SOLVED</span>
              </div>
              <div className="stat-block">
                <span className="stat-block__value">{stats.totalTests}</span>
                <span className="stat-block__label">TOTAL TEST CASES</span>
              </div>
              <div className="stat-block">
                <span className="stat-block__value">{stats.passRate}%</span>
                <span className="stat-block__label">PASS RATE</span>
              </div>
              <div className="stat-block">
                <span className="stat-block__value">{stats.totalRuntime.toFixed(1)}</span>
                <span className="stat-block__label">TOTAL RUNTIME MS</span>
              </div>
            </div>

            {/* ─── DIFFICULTY BREAKDOWN ─── */}
            <div style={styles.sectionHeader}>
              <span style={styles.sectionLabel}>DIFFICULTY BREAKDOWN</span>
            </div>
            <div style={styles.diffGrid}>
              {["Easy", "Medium", "Hard"].map((diff) => {
                const count = stats.byDifficulty[diff] || 0;
                const pct = stats.total > 0 ? ((count / stats.total) * 100).toFixed(0) : 0;
                const colors = {
                  Easy: "var(--accent-success)",
                  Medium: "var(--accent-warning)",
                  Hard: "var(--accent-danger)",
                };
                return (
                  <div key={diff} style={styles.diffBlock}>
                    <div style={styles.diffHeader}>
                      <span className={`label label--${diff.toLowerCase()}`}>
                        {diff.toUpperCase()}
                      </span>
                      <span style={styles.diffCount}>{count}</span>
                    </div>
                    <div style={styles.diffBar}>
                      <div
                        style={{
                          ...styles.diffBarFill,
                          width: `${pct}%`,
                          background: colors[diff],
                        }}
                      />
                    </div>
                    <span style={styles.diffPct}>{pct}%</span>
                  </div>
                );
              })}
            </div>

            {/* ─── TOPIC DISTRIBUTION ─── */}
            <div style={styles.sectionHeader}>
              <span style={styles.sectionLabel}>TOPIC DISTRIBUTION</span>
            </div>
            <div style={styles.topicGrid}>
              {topicEntries.map(([topic, count]) => (
                <div key={topic} style={styles.topicRow}>
                  <span style={styles.topicName}>{topic}</span>
                  <div style={styles.topicBar}>
                    <div
                      style={{
                        ...styles.topicBarFill,
                        width: `${(count / maxTopicCount) * 100}%`,
                      }}
                    />
                  </div>
                  <span style={styles.topicCount}>{count}</span>
                </div>
              ))}
            </div>

            {/* ─── FASTEST SOLUTIONS ─── */}
            <div style={styles.sectionHeader}>
              <span style={styles.sectionLabel}>FASTEST SOLUTIONS (AVG/TEST)</span>
            </div>
            <div style={styles.tableWrap}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>RANK</th>
                    <th style={{ width: 60 }}>#</th>
                    <th>TITLE</th>
                    <th style={{ width: 80 }}>DIFF</th>
                    <th style={{ textAlign: "right", width: 120 }}>AVG MS/TEST</th>
                    <th style={{ textAlign: "right", width: 80 }}>TESTS</th>
                  </tr>
                </thead>
                <tbody>
                  {fastestByAvg.map((p, i) => (
                    <tr key={p.id}>
                      <td style={styles.rank}>{i + 1}</td>
                      <td style={styles.mono}>{p.number}</td>
                      <td>
                        <Link href={`/problem/${p.id}`} style={styles.link}>
                          {p.title}
                        </Link>
                      </td>
                      <td>
                        <span className={`label label--${p.difficulty.toLowerCase()}`}>
                          {p.difficulty.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ textAlign: "right", ...styles.monoVal }}>
                        {p.avgRuntime.toFixed(4)}ms
                      </td>
                      <td style={{ textAlign: "right", ...styles.mono }}>
                        {p.tests}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ─── MOST TEST CASES ─── */}
            <div style={{ ...styles.sectionHeader, marginTop: 40 }}>
              <span style={styles.sectionLabel}>MOST TEST CASES</span>
            </div>
            <div style={styles.tableWrap}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>RANK</th>
                    <th style={{ width: 60 }}>#</th>
                    <th>TITLE</th>
                    <th style={{ textAlign: "right", width: 80 }}>TESTS</th>
                    <th style={{ textAlign: "right", width: 100 }}>PASS RATE</th>
                  </tr>
                </thead>
                <tbody>
                  {mostTests.map((p, i) => (
                    <tr key={p.id}>
                      <td style={styles.rank}>{i + 1}</td>
                      <td style={styles.mono}>{p.number}</td>
                      <td>
                        <Link href={`/problem/${p.id}`} style={styles.link}>
                          {p.title}
                        </Link>
                      </td>
                      <td style={{ textAlign: "right", ...styles.monoVal }}>
                        {p.tests}
                      </td>
                      <td style={{ textAlign: "right", ...styles.mono }}>
                        {((p.passed / p.tests) * 100).toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

const styles = {
  header: {
    padding: "32px 0 40px",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  breadcrumbLink: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    color: "var(--text-tertiary)",
    textDecoration: "none",
  },
  breadcrumbSep: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    color: "var(--text-tertiary)",
  },
  breadcrumbCurrent: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    color: "var(--accent-primary)",
  },
  title: {
    fontWeight: 900,
    fontSize: "clamp(2rem, 5vw, 3.5rem)",
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
    marginBottom: 16,
  },
  sub: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.82rem",
    color: "var(--text-tertiary)",
    letterSpacing: "0.02em",
  },
  content: {
    padding: "40px 0 80px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12,
    marginBottom: 48,
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid var(--border-primary)",
    paddingBottom: 8,
    marginBottom: 20,
  },
  sectionLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.2em",
    color: "var(--text-tertiary)",
  },
  diffGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
    marginBottom: 48,
  },
  diffBlock: {
    border: "2px solid var(--border-primary)",
    padding: 20,
    borderRadius: 2,
  },
  diffHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  diffCount: {
    fontFamily: "var(--font-mono)",
    fontSize: "1.5rem",
    fontWeight: 900,
  },
  diffBar: {
    height: 6,
    background: "var(--bg-tertiary)",
    borderRadius: 1,
    overflow: "hidden",
    marginBottom: 8,
  },
  diffBarFill: {
    height: "100%",
    borderRadius: 1,
    transition: "width 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  },
  diffPct: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    fontWeight: 600,
    color: "var(--text-tertiary)",
    letterSpacing: "0.1em",
  },
  topicGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 48,
  },
  topicRow: {
    display: "grid",
    gridTemplateColumns: "120px 1fr 40px",
    gap: 16,
    alignItems: "center",
  },
  topicName: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  topicBar: {
    height: 10,
    background: "var(--bg-tertiary)",
    borderRadius: 1,
    overflow: "hidden",
    border: "1px solid var(--border-secondary)",
  },
  topicBarFill: {
    height: "100%",
    background: "var(--accent-primary)",
    borderRadius: 1,
    transition: "width 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  },
  topicCount: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.75rem",
    fontWeight: 700,
    textAlign: "right",
  },
  tableWrap: {
    border: "2px solid var(--border-primary)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 0,
  },
  rank: {
    fontFamily: "var(--font-mono)",
    fontWeight: 900,
    fontSize: "0.8rem",
    color: "var(--accent-primary)",
  },
  mono: {
    fontFamily: "var(--font-mono)",
    fontWeight: 600,
    fontSize: "0.8rem",
    color: "var(--text-tertiary)",
  },
  monoVal: {
    fontFamily: "var(--font-mono)",
    fontWeight: 600,
    fontSize: "0.8rem",
  },
  link: {
    fontWeight: 700,
    fontSize: "0.88rem",
    color: "var(--text-primary)",
    textDecoration: "none",
  },
};
