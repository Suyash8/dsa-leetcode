#!/usr/bin/env python3
"""
aggregate_results.py — Aggregates LeetCode solution data into a single JSON file.

Reads from:
  - src/*/metadata.json       (problem metadata)
  - src/*/solution.cpp         (solution code, parsed via markers)
  - build/test_results/*_results.json  (per-test-case runtime/memory data)

Writes to:
  - data/results.json          (unified JSON consumed by the frontend)
"""

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path


def extract_between_markers(content: str, start_marker: str, end_marker: str) -> str:
    """Extract text between two marker comments in a C++ file."""
    pattern = re.compile(
        rf"//\s*---\s*{re.escape(start_marker)}\s*---\s*\n(.*?)//\s*---\s*{re.escape(end_marker)}\s*---",
        re.DOTALL,
    )
    match = pattern.search(content)
    if match:
        return match.group(1).strip()
    return ""


def extract_problem_number(problem_id: str) -> int:
    """Extract the numeric problem number from a directory name like '1108-defanging-an-ip-address'."""
    match = re.match(r"(\d+)", problem_id)
    if match:
        return int(match.group(1))
    return 0


def parse_solution_file(solution_path: Path) -> dict:
    """Parse a solution.cpp file and extract code sections using markers."""
    content = solution_path.read_text(encoding="utf-8")

    return {
        "solution_code": extract_between_markers(content, "START_SOLUTION_CLASS", "END_SOLUTION_CLASS"),
        "type_definitions_code": extract_between_markers(content, "START_TYPE_DEFINITIONS", "END_TYPE_DEFINITIONS"),
        "custom_data_structures_code": extract_between_markers(content, "START_CUSTOM_DATA_STRUCTURES", "END_CUSTOM_DATA_STRUCTURES"),
        "test_cases_code": extract_between_markers(content, "START_TEST_CASES", "END_TEST_CASES"),
    }


def load_metadata(metadata_path: Path) -> dict:
    """Load and return the metadata.json for a problem."""
    with open(metadata_path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_test_results(results_path: Path) -> dict | None:
    """Load the test results JSON file for a problem."""
    if not results_path.exists():
        return None
    with open(results_path, "r", encoding="utf-8") as f:
        return json.load(f)


def aggregate(project_root: Path) -> list[dict]:
    """Aggregate all problem data into a list of problem objects."""
    src_dir = project_root / "src"
    results_dir = project_root / "build" / "test_results"

    problems = []

    # Find all problem directories (those containing solution.cpp)
    problem_dirs = sorted(
        [d for d in src_dir.iterdir() if d.is_dir() and (d / "solution.cpp").exists()],
        key=lambda d: extract_problem_number(d.name),
    )

    for problem_dir in problem_dirs:
        problem_id = problem_dir.name
        solution_path = problem_dir / "solution.cpp"
        metadata_path = problem_dir / "metadata.json"

        # Parse solution code
        code_sections = parse_solution_file(solution_path)

        # Load metadata
        metadata = {}
        if metadata_path.exists():
            metadata = load_metadata(metadata_path)

        # Load test results
        test_results_path = results_dir / f"{problem_id}_results.json"
        test_results = load_test_results(test_results_path)

        # Build the problem object
        problem = {
            "id": problem_id,
            "number": extract_problem_number(problem_id),
            "title": metadata.get("title", problem_id),
            "difficulty": metadata.get("difficulty", "Unknown"),
            "topics": metadata.get("topics", []),
            "description": metadata.get("description", ""),
            "examples": metadata.get("examples", []),
            "constraints": metadata.get("constraints", []),
            "time_complexity": metadata.get("time_complexity", ""),
            "space_complexity": metadata.get("space_complexity", ""),
            "language": "cpp",
            "solution_code": code_sections["solution_code"],
            "type_definitions_code": code_sections["type_definitions_code"],
            "custom_data_structures_code": code_sections["custom_data_structures_code"],
            "test_cases_code": code_sections["test_cases_code"],
            "stats": None,
            "last_run": datetime.now(timezone.utc).isoformat(),
        }

        # Merge test results if available
        if test_results:
            problem["stats"] = {
                "total_tests": test_results.get("total_tests", 0),
                "passed_tests": test_results.get("passed_tests", 0),
                "failed_tests": test_results.get("failed_tests", 0),
                "total_runtime_ms": test_results.get("total_runtime_ms", 0),
                "average_runtime_ms": test_results.get("average_runtime_ms", 0),
                "max_runtime_ms": test_results.get("max_runtime_ms", 0),
                "total_memory_bytes": test_results.get("total_memory_bytes", 0),
                "test_results": test_results.get("test_results", []),
            }

        problems.append(problem)

    return problems


def main():
    # Determine project root (script is in scripts/, so go up one level)
    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parent

    # Allow override via command-line argument
    if len(sys.argv) > 1:
        project_root = Path(sys.argv[1]).resolve()

    # Output directory
    data_dir = project_root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    output_path = data_dir / "results.json"

    print(f"--- Aggregating Results ---")
    print(f"Project root: {project_root}")
    print(f"Source dir:    {project_root / 'src'}")
    print(f"Results dir:   {project_root / 'build' / 'test_results'}")
    print(f"Output:        {output_path}")

    problems = aggregate(project_root)

    # Write the output
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(problems, f, indent=2, ensure_ascii=False)

    print(f"Aggregated {len(problems)} problems → {output_path}")

    # Summary
    for p in problems:
        stats_str = "no results"
        if p["stats"]:
            s = p["stats"]
            stats_str = f"{s['passed_tests']}/{s['total_tests']} passed, {s['total_runtime_ms']:.3f}ms total, {s['total_memory_bytes']} bytes"
        print(f"  [{p['difficulty']:6s}] #{p['number']:>4d} {p['title']:<35s} — {stats_str}")


if __name__ == "__main__":
    main()
