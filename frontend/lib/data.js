import { readFileSync, existsSync } from "fs";
import path from "path";

/**
 * Loads the results.json data from the data/ directory.
 * This runs at build/server time in Next.js.
 */
export function loadResultsData() {
  const dataPath = path.join(process.cwd(), "..", "data", "results.json");

  if (!existsSync(dataPath)) {
    console.warn(`[DSA Lab] results.json not found at ${dataPath}`);
    return [];
  }

  const raw = readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
}

/**
 * Get a single problem by ID.
 */
export function getProblemById(id) {
  const data = loadResultsData();
  return data.find((p) => p.id === id) || null;
}

/**
 * Get all unique topics across all problems.
 */
export function getAllTopics(data) {
  const topicSet = new Set();
  data.forEach((p) => p.topics?.forEach((t) => topicSet.add(t)));
  return Array.from(topicSet).sort();
}

/**
 * Compute aggregate stats across all problems.
 */
export function computeGlobalStats(data) {
  const total = data.length;
  const byDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
  let totalTests = 0;
  let totalPassed = 0;
  let totalRuntime = 0;

  data.forEach((p) => {
    if (byDifficulty[p.difficulty] !== undefined) {
      byDifficulty[p.difficulty]++;
    }
    if (p.stats) {
      totalTests += p.stats.total_tests;
      totalPassed += p.stats.passed_tests;
      totalRuntime += p.stats.total_runtime_ms;
    }
  });

  const topicCounts = {};
  data.forEach((p) => {
    p.topics?.forEach((t) => {
      topicCounts[t] = (topicCounts[t] || 0) + 1;
    });
  });

  return {
    total,
    byDifficulty,
    totalTests,
    totalPassed,
    totalRuntime,
    passRate: totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : "0",
    topicCounts,
  };
}
