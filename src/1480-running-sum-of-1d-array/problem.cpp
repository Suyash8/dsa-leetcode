#include <iostream>
#include <utility>
#include <vector>

// --- START_CUSTOM_DATA_STRUCTURES ---
// No custom data structures for this problem
// --- END_CUSTOM_DATA_STRUCTURES ---

// --- START_TYPE_DEFINITIONS ---
using Input = std::vector<int>;
using Output = std::vector<int>;
using TestCase = std::pair<Input, Output>;
// --- END_TYPE_DEFINITIONS ---

// --- START_TEST_CASES ---
static const std::vector<TestCase> test_cases = {
    // ---- Minimal / edge cases ----
    {{}, {}},     // empty input → empty output
    {{0}, {0}},   // single element, zero
    {{5}, {5}},   // single positive
    {{-3}, {-3}}, // single negative

    // ---- Small typical arrays ----
    {{1, 2, 3, 4}, {1, 3, 6, 10}},         // strictly increasing
    {{1, 1, 1, 1}, {1, 2, 3, 4}},          // all ones
    {{3, 1, 2, 10, 1}, {3, 4, 6, 16, 17}}, // mixed
    {{-1, -2, -3, -4}, {-1, -3, -6, -10}}, // all negative
    {{1, -1, 1, -1}, {1, 0, 1, 0}},        // alternating sign

    // ---- Arrays with zeros ----
    {{0, 0, 0, 0}, {0, 0, 0, 0}},  // all zeros
    {{5, 0, 0, 5}, {5, 5, 5, 10}}, // zeros in between

    // ---- Larger values ----
    {{1000, 2000, 3000}, {1000, 3000, 6000}},   // large positives
    {{-1000, 500, -500}, {-1000, -500, -1000}}, // large mix

    // ---- Stress-like pattern ----
    {{1, 2, 3, 4, 5, 6, 7, 8, 9, 10},
     {1, 3, 6, 10, 15, 21, 28, 36, 45, 55}}, // 1 to 10
};
// --- END_TEST_CASES ---

// --- START_SOLUTION_CLASS ---
#include "solution.cpp"

Output run_solve(Solution& solution, const Input &input) {
    std::vector<int> nums = input;
    return solution.runningSum(nums);
  }

// --- END_SOLUTION_CLASS ---
