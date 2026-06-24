import { loadResultsData } from "@/lib/data";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import CodeDisplay from "../../components/CodeDisplay";
import TestResultsTable from "../../components/TestResultsTable";
import PerformanceBar from "../../components/PerformanceBar";
import Link from "next/link";

export async function generateStaticParams() {
  const data = loadResultsData();
  return data.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const data = loadResultsData();
  const problem = data.find((p) => p.id === id);
  if (!problem) return { title: "Problem Not Found" };
  return {
    title: `#${problem.number} ${problem.title} — DSA Lab`,
    description: problem.description?.slice(0, 160),
  };
}

export default async function ProblemPage({ params }) {
  const { id } = await params;
  const data = loadResultsData();
  const problem = data.find((p) => p.id === id);

  if (!problem) notFound();

  const currentIndex = data.findIndex((p) => p.id === id);
  const prevProblem = currentIndex > 0 ? data[currentIndex - 1] : null;
  const nextProblem = currentIndex < data.length - 1 ? data[currentIndex + 1] : null;

  return (
    <>
      <Navbar />
      <main>
        {/* ─── PROBLEM HEADER ─── */}
        <section style={styles.header}>
          <div className="container">
            <div style={styles.breadcrumb}>
              <Link href="/" style={styles.breadcrumbLink}>INDEX</Link>
              <span style={styles.breadcrumbSep}>/</span>
              <span style={styles.breadcrumbCurrent}>#{problem.number}</span>
            </div>

            <div style={styles.headerMain}>
              <div style={styles.headerText}>
                <div style={styles.problemNumber}>
                  <span style={styles.numberHash}>#</span>
                  {problem.number}
                </div>
                <h1 style={styles.title}>{problem.title}</h1>
                <div style={styles.tagRow}>
                  <span className={`label label--${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty.toUpperCase()}
                  </span>
                  {problem.topics?.map((t) => (
                    <span key={t} className="label label--topic">{t}</span>
                  ))}
                  <span className="label" style={{ marginLeft: "auto" }}>
                    C++17
                  </span>
                </div>
              </div>

              {/* ─── QUICK STATS ─── */}
              {problem.stats && (
                <div style={styles.quickStats} className="stagger">
                  <div className="stat-block">
                    <span className="stat-block__value">
                      <span style={{ color: "var(--accent-success)" }}>{problem.stats.passed_tests}</span>
                      <span style={{ color: "var(--text-tertiary)", fontSize: "1.2rem" }}>/{problem.stats.total_tests}</span>
                    </span>
                    <span className="stat-block__label">TESTS PASSED</span>
                  </div>
                  <div className="stat-block">
                    <span className="stat-block__value">{problem.stats.total_runtime_ms.toFixed(3)}</span>
                    <span className="stat-block__label">TOTAL MS</span>
                  </div>
                  <div className="stat-block">
                    <span className="stat-block__value">{problem.stats.average_runtime_ms.toFixed(4)}</span>
                    <span className="stat-block__label">AVG MS/TEST</span>
                  </div>
                  <div className="stat-block">
                    <span className="stat-block__value">{problem.stats.total_memory_kb}</span>
                    <span className="stat-block__label">MEMORY KB</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ─── CONTENT GRID ─── */}
        <section style={styles.content}>
          <div className="container">
            <div style={styles.grid}>
              {/* LEFT: Problem Description */}
              <div style={styles.leftCol}>
                <div style={styles.sectionHeader}>
                  <span style={styles.sectionLabel}>DESCRIPTION</span>
                </div>
                <div style={styles.descBlock}>
                  <p style={styles.descText}>{problem.description}</p>
                </div>

                {/* Examples */}
                {problem.examples?.length > 0 && (
                  <>
                    <div style={styles.sectionHeader}>
                      <span style={styles.sectionLabel}>EXAMPLES</span>
                    </div>
                    {problem.examples.map((ex, i) => (
                      <div key={i} style={styles.exampleBlock}>
                        <div style={styles.exampleNum}>EXAMPLE {i + 1}</div>
                        <div style={styles.exampleRow}>
                          <span style={styles.exampleKey}>INPUT</span>
                          <code style={styles.exampleVal}>{ex.input}</code>
                        </div>
                        <div style={styles.exampleRow}>
                          <span style={styles.exampleKey}>OUTPUT</span>
                          <code style={styles.exampleVal}>{ex.output}</code>
                        </div>
                        {ex.explanation && (
                          <div style={styles.exampleExpl}>
                            <span style={styles.exampleKey}>NOTE</span>
                            <span style={styles.exampleExplText}>{ex.explanation}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}

                {/* Constraints */}
                {problem.constraints?.length > 0 && (
                  <>
                    <div style={styles.sectionHeader}>
                      <span style={styles.sectionLabel}>CONSTRAINTS</span>
                    </div>
                    <div style={styles.constraintBlock}>
                      {problem.constraints.map((c, i) => (
                        <div key={i} style={styles.constraintItem}>
                          <span style={styles.constraintBullet}>▪</span>
                          <code style={styles.constraintText}>{c}</code>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Complexity */}
                <div style={styles.sectionHeader}>
                  <span style={styles.sectionLabel}>COMPLEXITY</span>
                </div>
                <div style={styles.complexityRow}>
                  <div style={styles.complexityBlock}>
                    <span style={styles.complexityLabel}>TIME</span>
                    <code style={styles.complexityValue}>{problem.time_complexity || "—"}</code>
                  </div>
                  <div style={styles.complexityBlock}>
                    <span style={styles.complexityLabel}>SPACE</span>
                    <code style={styles.complexityValue}>{problem.space_complexity || "—"}</code>
                  </div>
                </div>
              </div>

              {/* RIGHT: Code + Test Results */}
              <div style={styles.rightCol}>
                <div style={styles.sectionHeader}>
                  <span style={styles.sectionLabel}>SOLUTION</span>
                </div>
                <CodeDisplay code={problem.solution_code} label="SOLUTION CLASS" />

                {problem.type_definitions_code && (
                  <>
                    <div style={{ ...styles.sectionHeader, marginTop: 24 }}>
                      <span style={styles.sectionLabel}>TYPE DEFINITIONS</span>
                    </div>
                    <CodeDisplay code={problem.type_definitions_code} label="TYPES" />
                  </>
                )}

                {/* Performance Chart */}
                {problem.stats?.test_results && (
                  <>
                    <div style={{ ...styles.sectionHeader, marginTop: 32 }}>
                      <span style={styles.sectionLabel}>RUNTIME DISTRIBUTION</span>
                    </div>
                    <PerformanceBar testResults={problem.stats.test_results} />
                  </>
                )}

                {/* Test Results Table */}
                {problem.stats?.test_results && (
                  <>
                    <div style={{ ...styles.sectionHeader, marginTop: 32 }}>
                      <span style={styles.sectionLabel}>TEST RESULTS</span>
                      <span style={styles.sectionCount}>
                        {problem.stats.total_tests} CASES
                      </span>
                    </div>
                    <TestResultsTable results={problem.stats.test_results} />
                  </>
                )}
              </div>
            </div>

            {/* ─── NAVIGATION ─── */}
            <div style={styles.navRow}>
              {prevProblem ? (
                <Link href={`/problem/${prevProblem.id}`} style={styles.navBtn}>
                  <span style={styles.navBtnLabel}>← PREV</span>
                  <span style={styles.navBtnTitle}>#{prevProblem.number} {prevProblem.title}</span>
                </Link>
              ) : <div />}
              {nextProblem ? (
                <Link href={`/problem/${nextProblem.id}`} style={{ ...styles.navBtn, textAlign: "right" }}>
                  <span style={styles.navBtnLabel}>NEXT →</span>
                  <span style={styles.navBtnTitle}>#{nextProblem.number} {nextProblem.title}</span>
                </Link>
              ) : <div />}
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
  headerMain: {
    display: "flex",
    flexDirection: "column",
    gap: 28,
  },
  headerText: {},
  problemNumber: {
    fontFamily: "var(--font-mono)",
    fontSize: "clamp(3rem, 8vw, 6rem)",
    fontWeight: 900,
    lineHeight: 1,
    letterSpacing: "-0.04em",
    color: "var(--text-primary)",
    marginBottom: 4,
    opacity: 0.12,
    position: "absolute",
    right: 24,
    top: 80,
    userSelect: "none",
    display: "none",
  },
  numberHash: {
    color: "var(--accent-primary)",
    opacity: 0.6,
  },
  title: {
    fontWeight: 900,
    fontSize: "clamp(2rem, 5vw, 3.5rem)",
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
    marginBottom: 16,
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  quickStats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 12,
  },
  content: {
    padding: "40px 0 60px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 40,
    alignItems: "start",
  },
  leftCol: {},
  rightCol: {},
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid var(--border-primary)",
    paddingBottom: 8,
    marginBottom: 16,
    marginTop: 0,
  },
  sectionLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.2em",
    color: "var(--text-tertiary)",
  },
  sectionCount: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.6rem",
    fontWeight: 600,
    letterSpacing: "0.15em",
    color: "var(--text-tertiary)",
  },
  descBlock: {
    marginBottom: 32,
  },
  descText: {
    fontSize: "0.92rem",
    lineHeight: 1.7,
    color: "var(--text-secondary)",
  },
  exampleBlock: {
    border: "2px solid var(--border-primary)",
    padding: 20,
    marginBottom: 12,
    borderRadius: 2,
  },
  exampleNum: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.2em",
    color: "var(--text-tertiary)",
    marginBottom: 12,
  },
  exampleRow: {
    display: "flex",
    gap: 16,
    alignItems: "baseline",
    marginBottom: 6,
  },
  exampleKey: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    color: "var(--accent-primary)",
    minWidth: 55,
    flexShrink: 0,
  },
  exampleVal: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.82rem",
    color: "var(--text-primary)",
    wordBreak: "break-all",
  },
  exampleExpl: {
    marginTop: 8,
    paddingTop: 8,
    borderTop: "1px solid var(--border-secondary)",
    display: "flex",
    gap: 16,
    alignItems: "baseline",
  },
  exampleExplText: {
    fontSize: "0.8rem",
    color: "var(--text-tertiary)",
    fontStyle: "italic",
  },
  constraintBlock: {
    marginBottom: 32,
  },
  constraintItem: {
    display: "flex",
    gap: 10,
    alignItems: "baseline",
    padding: "6px 0",
  },
  constraintBullet: {
    color: "var(--accent-primary)",
    fontSize: "0.6rem",
    flexShrink: 0,
  },
  constraintText: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.8rem",
    color: "var(--text-secondary)",
  },
  complexityRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 32,
  },
  complexityBlock: {
    border: "2px solid var(--border-primary)",
    padding: "16px 20px",
    borderRadius: 2,
  },
  complexityLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.55rem",
    fontWeight: 700,
    letterSpacing: "0.2em",
    color: "var(--text-tertiary)",
    display: "block",
    marginBottom: 4,
  },
  complexityValue: {
    fontFamily: "var(--font-mono)",
    fontSize: "1.4rem",
    fontWeight: 700,
    color: "var(--accent-primary)",
  },
  navRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "stretch",
    gap: 16,
    marginTop: 60,
    paddingTop: 24,
    borderTop: "2px solid var(--border-primary)",
  },
  navBtn: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    textDecoration: "none",
    color: "var(--text-primary)",
    padding: "12px 0",
  },
  navBtnLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    color: "var(--accent-primary)",
  },
  navBtnTitle: {
    fontFamily: "var(--font-sans)",
    fontSize: "0.88rem",
    fontWeight: 700,
    color: "var(--text-secondary)",
  },
};
