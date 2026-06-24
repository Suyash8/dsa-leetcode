"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function ProblemList({ problems, topics }) {
  const [search, setSearch] = useState("");
  const [filterDifficulties, setFilterDifficulties] = useState([]);
  const [filterTopics, setFilterTopics] = useState([]);
  const [sortBy, setSortBy] = useState("number");

  const filtered = useMemo(() => {
    let result = problems;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          String(p.number).includes(q)
      );
    }

    if (filterDifficulties.length > 0) {
      result = result.filter((p) => filterDifficulties.includes(p.difficulty));
    }

    if (filterTopics.length > 0) {
      result = result.filter((p) => p.topics?.some((t) => filterTopics.includes(t)));
    }

    result = [...result].sort((a, b) => {
      if (sortBy === "number") return a.number - b.number;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "difficulty") {
        const order = { Easy: 0, Medium: 1, Hard: 2 };
        return (order[a.difficulty] || 0) - (order[b.difficulty] || 0);
      }
      if (sortBy === "runtime") {
        return (a.stats?.total_runtime_ms || 0) - (b.stats?.total_runtime_ms || 0);
      }
      return 0;
    });

    return result;
  }, [problems, search, filterDifficulties, filterTopics, sortBy]);

  return (
    <div>
      {/* ─── TOOLBAR ─── */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>⌕</span>
            <input
              type="text"
              placeholder="SEARCH PROBLEMS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
              id="search-problems"
            />
          </div>
        </div>
        <div style={styles.toolbarRight}>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>DIFF</span>
            <select
              value=""
              onChange={(e) => {
                const val = e.target.value;
                if (val && !filterDifficulties.includes(val)) {
                  setFilterDifficulties((prev) => [...prev, val]);
                }
              }}
              style={styles.select}
              id="filter-difficulty"
            >
              <option value="" disabled>+ DIFF</option>
              <option value="Easy">EASY</option>
              <option value="Medium">MEDIUM</option>
              <option value="Hard">HARD</option>
            </select>
          </div>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>TOPIC</span>
            <select
              value=""
              onChange={(e) => {
                const val = e.target.value;
                if (val && !filterTopics.includes(val)) {
                  setFilterTopics((prev) => [...prev, val]);
                }
              }}
              style={styles.select}
              id="filter-topic"
            >
              <option value="" disabled>+ TOPIC</option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>SORT</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={styles.select}
              id="sort-by"
            >
              <option value="number">#</option>
              <option value="title">TITLE</option>
              <option value="difficulty">DIFF</option>
              <option value="runtime">RUNTIME</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── ACTIVE FILTERS ─── */}
      {(filterDifficulties.length > 0 || filterTopics.length > 0) && (
        <div style={styles.activeFilters}>
          {filterDifficulties.map(d => (
            <span 
              key={d} 
              className={`label label--${d.toLowerCase()}`}
              style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
              onClick={() => setFilterDifficulties(prev => prev.filter(x => x !== d))}
            >
              {d.toUpperCase()} <span style={{fontSize: "0.8em"}}>✕</span>
            </span>
          ))}
          {filterTopics.map(t => (
            <span 
              key={t} 
              className="label label--topic"
              style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
              onClick={() => setFilterTopics(prev => prev.filter(x => x !== t))}
            >
              {t.toUpperCase()} <span style={{fontSize: "0.8em"}}>✕</span>
            </span>
          ))}
          <button 
            style={styles.clearFiltersBtn}
            onClick={() => { setFilterDifficulties([]); setFilterTopics([]); }}
          >
            CLEAR ALL
          </button>
        </div>
      )}

      {/* ─── COUNT ─── */}
      <div style={styles.countBar}>
        <span style={styles.countText}>
          {filtered.length} PROBLEM{filtered.length !== 1 ? "S" : ""}
        </span>
      </div>

      {/* ─── PROBLEM TABLE ─── */}
      <div style={styles.tableWrap}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 60, cursor: "pointer" }} onClick={() => setSortBy("number")}>#</th>
              <th style={{ cursor: "pointer" }} onClick={() => setSortBy("title")}>TITLE</th>
              <th style={{ width: 80, cursor: "pointer" }} onClick={() => setSortBy("difficulty")}>DIFF</th>
              <th style={{ width: 140 }}>TOPICS</th>
              <th style={{ width: 80, textAlign: "right" }}>TESTS</th>
              <th style={{ width: 90, textAlign: "right", cursor: "pointer" }} onClick={() => setSortBy("runtime")}>RUNTIME</th>
              <th style={{ width: 90, textAlign: "right" }}>MEMORY</th>
              <th style={{ width: 70, textAlign: "center" }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} style={{ animationDelay: `${i * 0.03}s` }}>
                <td>
                  <span style={styles.problemNum}>{p.number}</span>
                </td>
                <td>
                  <Link href={`/problem/${p.id}`} style={styles.problemLink}>
                    {p.title}
                  </Link>
                </td>
                <td>
                  <span
                    className={`label label--${p.difficulty.toLowerCase()}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (!filterDifficulties.includes(p.difficulty)) {
                        setFilterDifficulties(prev => [...prev, p.difficulty]);
                      }
                    }}
                  >
                    {p.difficulty.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div style={styles.topicWrap}>
                    {p.topics?.map((t) => (
                      <span
                        key={t}
                        className="label label--topic"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (!filterTopics.includes(t)) {
                            setFilterTopics(prev => [...prev, t]);
                          }
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>
                  {p.stats ? (
                    <span>
                      <span style={{ color: "var(--accent-success)" }}>{p.stats.passed_tests}</span>
                      <span style={{ color: "var(--text-tertiary)" }}>/{p.stats.total_tests}</span>
                    </span>
                  ) : (
                    <span style={{ color: "var(--text-tertiary)" }}>—</span>
                  )}
                </td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>
                  {p.stats ? (
                    <span>{p.stats.total_runtime_ms.toFixed(3)}ms</span>
                  ) : (
                    <span style={{ color: "var(--text-tertiary)" }}>—</span>
                  )}
                </td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>
                  {p.stats ? (
                    <span>{p.stats.total_memory_bytes} B</span>
                  ) : (
                    <span style={{ color: "var(--text-tertiary)" }}>—</span>
                  )}
                </td>
                <td style={{ textAlign: "center" }}>
                  {p.stats && p.stats.failed_tests === 0 ? (
                    <span style={styles.statusPass}>✓</span>
                  ) : (
                    <span style={styles.statusFail}>✗</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={styles.empty}>
            <span style={styles.emptyText}>NO MATCHING PROBLEMS</span>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "stretch",
    gap: 12,
    marginBottom: 0,
    flexWrap: "wrap",
  },
  toolbarLeft: {
    flex: 1,
    minWidth: 240,
  },
  toolbarRight: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    border: "2px solid var(--border-primary)",
    background: "var(--bg-primary)",
    height: "100%",
    minHeight: 44,
    borderRadius: 2,
  },
  searchIcon: {
    fontFamily: "var(--font-mono)",
    fontSize: "1rem",
    padding: "0 12px",
    color: "var(--text-tertiary)",
  },
  searchInput: {
    flex: 1,
    border: "none",
    background: "transparent",
    fontFamily: "var(--font-mono)",
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    color: "var(--text-primary)",
    outline: "none",
    padding: "12px 12px 12px 0",
    width: "100%",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  filterLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.55rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    color: "var(--text-tertiary)",
    padding: "4px 10px 0",
    background: "var(--bg-secondary)",
    border: "2px solid var(--border-primary)",
    borderBottom: "none",
    borderRadius: "2px 2px 0 0",
  },
  select: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    padding: "8px 10px",
    border: "2px solid var(--border-primary)",
    borderTop: "1px solid var(--border-secondary)",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    cursor: "pointer",
    borderRadius: "0 0 2px 2px",
    outline: "none",
    minWidth: 70,
    appearance: "none",
    WebkitAppearance: "none",
  },
  countBar: {
    padding: "12px 0",
    borderBottom: "1px solid var(--border-secondary)",
    marginBottom: 0,
  },
  countText: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    color: "var(--text-tertiary)",
  },
  tableWrap: {
    border: "2px solid var(--border-primary)",
    borderRadius: 2,
    overflow: "hidden",
  },
  problemNum: {
    fontFamily: "var(--font-mono)",
    fontWeight: 700,
    fontSize: "0.8rem",
    color: "var(--text-tertiary)",
  },
  problemLink: {
    fontWeight: 700,
    fontSize: "0.88rem",
    color: "var(--text-primary)",
    textDecoration: "none",
    borderBottom: "1px solid transparent",
    transition: "border-color 0.1s",
  },
  topicWrap: {
    display: "flex",
    gap: 4,
    flexWrap: "wrap",
  },
  statusPass: {
    fontFamily: "var(--font-mono)",
    fontWeight: 900,
    fontSize: "1rem",
    color: "var(--accent-success)",
  },
  statusFail: {
    fontFamily: "var(--font-mono)",
    fontWeight: 900,
    fontSize: "1rem",
    color: "var(--accent-danger)",
  },
  empty: {
    padding: 60,
    textAlign: "center",
  },
  emptyText: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    color: "var(--text-tertiary)",
  },
  activeFilters: {
    display: "flex",
    gap: 8,
    padding: "12px 0 0 0",
    flexWrap: "wrap",
    alignItems: "center",
  },
  clearFiltersBtn: {
    background: "transparent",
    border: "none",
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    fontWeight: 700,
    color: "var(--text-tertiary)",
    cursor: "pointer",
    textDecoration: "underline",
    marginLeft: 8,
  },
};
