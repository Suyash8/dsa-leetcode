"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link href="/" style={styles.logo}>
          <span style={styles.logoMark}>▬</span>
          <span style={styles.logoText}>DSA</span>
          <span style={styles.logoDot}>LAB</span>
        </Link>

        <div style={styles.navLinks}>
          <Link href="/" style={styles.navLink}>
            INDEX
          </Link>
          <Link href="/stats" style={styles.navLink}>
            STATS
          </Link>
          <div style={styles.dividerVert} />
          {mounted && (
            <button
              onClick={toggleTheme}
              style={styles.themeToggle}
              aria-label="Toggle theme"
              id="theme-toggle"
            >
              <span style={styles.toggleTrack}>
                <span
                  style={{
                    ...styles.toggleKnob,
                    transform:
                      theme === "dark"
                        ? "translateX(20px)"
                        : "translateX(0px)",
                    background:
                      theme === "dark"
                        ? "var(--text-primary)"
                        : "var(--text-primary)",
                  }}
                />
              </span>
              <span style={styles.toggleLabel}>
                {theme === "dark" ? "DRK" : "LGT"}
              </span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    borderBottom: "var(--border)",
    background: "var(--bg-primary)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    transition: "background-color 0.15s",
  },
  inner: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    textDecoration: "none",
    color: "var(--text-primary)",
  },
  logoMark: {
    fontFamily: "var(--font-mono)",
    fontSize: "1rem",
    color: "var(--accent-primary)",
  },
  logoText: {
    fontFamily: "var(--font-sans)",
    fontWeight: 900,
    fontSize: "1.05rem",
    letterSpacing: "-0.03em",
  },
  logoDot: {
    fontFamily: "var(--font-mono)",
    fontWeight: 500,
    fontSize: "0.7rem",
    letterSpacing: "0.1em",
    color: "var(--text-tertiary)",
    borderLeft: "1px solid var(--border-secondary)",
    paddingLeft: 8,
    marginLeft: 2,
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  navLink: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "var(--text-secondary)",
    textDecoration: "none",
    padding: "6px 0",
    transition: "color 0.1s",
  },
  dividerVert: {
    width: 1,
    height: 20,
    background: "var(--border-secondary)",
  },
  themeToggle: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  toggleTrack: {
    width: 40,
    height: 20,
    border: "2px solid var(--border-primary)",
    borderRadius: 2,
    position: "relative",
    display: "block",
    transition: "border-color 0.15s",
  },
  toggleKnob: {
    width: 16,
    height: 16,
    display: "block",
    borderRadius: 1,
    transition: "transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    position: "absolute",
    top: 0,
    left: 0,
  },
  toggleLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    color: "var(--text-tertiary)",
  },
};
