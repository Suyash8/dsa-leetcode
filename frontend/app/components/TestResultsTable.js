"use client";

export default function TestResultsTable({ results }) {
  if (!results || results.length === 0) return null;

  return (
    <div style={styles.wrapper}>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: 50 }}>#</th>
            <th style={{ width: 70, textAlign: "center" }}>STATUS</th>
            <th style={{ textAlign: "right" }}>RUNTIME</th>
            <th style={{ textAlign: "right" }}>MEMORY</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.index}>
              <td>
                <span style={styles.index}>{r.index + 1}</span>
              </td>
              <td style={{ textAlign: "center" }}>
                {r.passed ? (
                  <span style={styles.pass}>PASS</span>
                ) : (
                  <span style={styles.fail}>FAIL</span>
                )}
              </td>
              <td style={{ textAlign: "right" }}>
                <span style={styles.runtime}>{r.runtime_ms.toFixed(4)}</span>
                <span style={styles.unit}>ms</span>
              </td>
              <td style={{ textAlign: "right" }}>
                <span style={styles.memory}>{r.memory_bytes}</span>
                <span style={styles.unit}>B</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  wrapper: {
    border: "2px solid var(--border-primary)",
    borderRadius: 2,
    overflow: "hidden",
    maxHeight: 500,
    overflowY: "auto",
  },
  index: {
    fontFamily: "var(--font-mono)",
    fontWeight: 600,
    fontSize: "0.75rem",
    color: "var(--text-tertiary)",
  },
  pass: {
    fontFamily: "var(--font-mono)",
    fontWeight: 700,
    fontSize: "0.65rem",
    letterSpacing: "0.1em",
    color: "var(--accent-success)",
    border: "1px solid var(--accent-success)",
    padding: "2px 8px",
    borderRadius: 1,
  },
  fail: {
    fontFamily: "var(--font-mono)",
    fontWeight: 700,
    fontSize: "0.65rem",
    letterSpacing: "0.1em",
    color: "var(--accent-danger)",
    border: "1px solid var(--accent-danger)",
    padding: "2px 8px",
    borderRadius: 1,
  },
  runtime: {
    fontFamily: "var(--font-mono)",
    fontWeight: 600,
    fontSize: "0.8rem",
  },
  memory: {
    fontFamily: "var(--font-mono)",
    fontWeight: 600,
    fontSize: "0.8rem",
  },
  unit: {
    fontFamily: "var(--font-mono)",
    fontWeight: 400,
    fontSize: "0.65rem",
    color: "var(--text-tertiary)",
    marginLeft: 3,
  },
};
