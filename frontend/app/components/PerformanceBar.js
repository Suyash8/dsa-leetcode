"use client";

export default function PerformanceBar({ testResults }) {
  if (!testResults || testResults.length === 0) return null;

  const runtimes = testResults.map((r) => r.runtime_ms);
  const maxRuntime = Math.max(...runtimes);

  return (
    <div style={styles.wrapper}>
      <div style={styles.chart}>
        {testResults.map((r, i) => {
          const pct = maxRuntime > 0 ? (r.runtime_ms / maxRuntime) * 100 : 0;
          return (
            <div key={i} style={styles.barCol}>
              <div style={styles.barTrack}>
                <div
                  style={{
                    ...styles.barFill,
                    height: `${Math.max(pct, 3)}%`,
                    background: r.passed
                      ? "var(--accent-primary)"
                      : "var(--accent-danger)",
                  }}
                  title={`Test ${i + 1}: ${r.runtime_ms.toFixed(4)}ms`}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div style={styles.legend}>
        <span style={styles.legendItem}>
          <span style={styles.legendMin}>MIN {Math.min(...runtimes).toFixed(4)}ms</span>
        </span>
        <span style={styles.legendItem}>
          <span style={styles.legendMax}>MAX {maxRuntime.toFixed(4)}ms</span>
        </span>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    border: "2px solid var(--border-primary)",
    padding: 20,
    borderRadius: 2,
  },
  chart: {
    display: "flex",
    gap: 2,
    alignItems: "flex-end",
    height: 80,
    marginBottom: 12,
  },
  barCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    height: "100%",
  },
  barTrack: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  barFill: {
    width: "100%",
    minHeight: 2,
    borderRadius: "1px 1px 0 0",
    transition: "height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  },
  legend: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid var(--border-secondary)",
    paddingTop: 8,
  },
  legendItem: {},
  legendMin: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.6rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    color: "var(--text-tertiary)",
  },
  legendMax: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.6rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    color: "var(--accent-primary)",
  },
};
