"use client";

import { highlightCpp } from "@/lib/highlight";
import { useState } from "react";

export default function CodeDisplay({ code, label }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
    }
  };

  if (!code) return null;

  const highlighted = highlightCpp(code);

  return (
    <div>
      <div className="code-block__header">
        <span>{label}</span>
        <button onClick={handleCopy} style={styles.copyBtn} aria-label="Copy code">
          {copied ? "COPIED ✓" : "COPY"}
        </button>
      </div>
      <pre
        className="code-block"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  );
}

const styles = {
  copyBtn: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    background: "transparent",
    border: "1px solid var(--border-secondary)",
    color: "var(--text-tertiary)",
    padding: "3px 10px",
    cursor: "pointer",
    borderRadius: 2,
    transition: "all 0.1s",
  },
};
