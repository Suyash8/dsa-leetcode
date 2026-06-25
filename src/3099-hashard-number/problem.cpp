#include <utility>
#include <vector>

// --- START_CUSTOM_DATA_STRUCTURES ---
// No custom data structures for this problem
// --- END_CUSTOM_DATA_STRUCTURES ---

// --- START_TYPE_DEFINITIONS ---
using Input = int;
using Output = int;
using TestCase = std::pair<Input, Output>;
// --- END_TYPE_DEFINITIONS ---

// --- START_TEST_CASES ---
static const std::vector<TestCase> test_cases = {
    // ---- Single-digit numbers (all are Harshad) ----
    {1, 1}, // 1 % 1 = 0
    {2, 2}, // 2 % 2 = 0
    {3, 3},
    {4, 4},
    {5, 5},
    {6, 6},
    {7, 7},
    {8, 8},
    {9, 9},

    // ---- Obvious multi-digit Harshad numbers ----
    {10, 1},   // 10 % (1+0) = 0
    {12, 3},   // 12 % (1+2=3) = 0
    {18, 9},   // 18 % 9 = 0
    {20, 2},   // 20 % 2 = 0
    {21, 3},   // 21 % 3 = 0
    {30, 3},   // 30 % 3 = 0
    {111, 3},  // 111 % 3 = 0
    {108, 9},  // 108 % 9 = 0
    {444, 12}, // 444 % (4+4+4=12) = 0
    {500, 5},  // 500 % 5 = 0
    {100, 1},  // 100 % 1 = 0

    // ---- Failing cases (non-Harshad) ----
    {11, -1},  // 11 % (1+1=2) != 0
    {13, -1},  // 13 % 4 != 0
    {14, -1},  // 14 % 5 != 0
    {15, -1},  // 15 % 6 != 0
    {16, -1},  // 16 % 7 != 0
    {17, -1},  // 17 % 8 != 0
    {19, -1},  // 19 % 10 != 0
    {22, -1},  // 22 % 4 != 0
    {25, -1},  // 25 % 7 != 0
    {29, -1},  // 29 % 11 != 0
    {37, -1},  // 37 % 10 != 0
    {99, -1},  // 99 % 18 != 0
    {101, -1}, // 101 % 2 != 0
    {109, -1}, // 109 % 10 != 0
    {199, -1}, // 199 % 19 != 0
    {487, -1}, // 487 % 19 != 0
    {501, -1}, // 501 % 6 != 0
    {123, -1}, // 123 % 6 != 0

    // ---- More valid edgey ones ----
    {120, 3}, // 1+2+0=3, 120 % 3 = 0
    {126, 9}, // 1+2+6=9, 126 % 9 = 0
    {360, 9}, // 3+6+0=9, 360 % 9 = 0
};
// --- END_TEST_CASES ---

// --- START_SOLUTION_CLASS ---
#include "solution.cpp"

Output run_solve(Solution &solution, const Input &input) {
  return solution.sumOfTheDigitsOfHarshadNumber(input);
}

// --- END_SOLUTION_CLASS ---