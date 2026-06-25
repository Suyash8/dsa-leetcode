# How to Add a New Problem to Your Personal LeetCode

This guide explains how to properly add a new problem so that it integrates seamlessly into the automated C++ test suite and the Next.js frontend.

## 1. Folder Structure

Create a new folder in `src/` using the format `{number}-{slug}`. For example:
`src/0001-two-sum/`

Inside this folder, you MUST have three files:
- `metadata.json`
- `problem.cpp`
- `solution.cpp`

## 2. `metadata.json`

This file configures the frontend display. It must contain the problem's metadata in the following format:

```json
{
  "title": "Two Sum",
  "difficulty": "Easy",
  "topics": ["Array", "Hash Table"],
  "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  "time_complexity": "O(n)",
  "space_complexity": "O(n)",
  "examples": [
    {
      "input": "nums = [2,7,11,15], target = 9",
      "output": "[0,1]",
      "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
    }
  ],
  "constraints": [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9"
  ]
}
```

## 3. `problem.cpp`

This file is the scaffold that glues your solution to the test framework. It contains the type definitions, test cases, and a wrapper to invoke your solution. 
It **MUST** contain specific marker comments (`--- START_...`) so the data aggregator can parse it for the UI.

Here is a scaffold for `problem.cpp`:

```cpp
#include <iostream>
#include <utility>
#include <vector>
#include <string>

// --- START_CUSTOM_DATA_STRUCTURES ---
// Define custom structs/classes here (e.g. ListNode, TreeNode)
// --- END_CUSTOM_DATA_STRUCTURES ---

// --- START_TYPE_DEFINITIONS ---
// Define the exact types for the Input and Output
using Input = std::pair<std::vector<int>, int>;
using Output = std::vector<int>;
using TestCase = std::pair<Input, Output>;
// --- END_TYPE_DEFINITIONS ---

// --- START_TEST_CASES ---
// Provide the test cases based on your type definitions
static const std::vector<TestCase> test_cases = {
    {{{2, 7, 11, 15}, 9}, {0, 1}},
    {{{3, 2, 4}, 6}, {1, 2}},
    {{{3, 3}, 6}, {0, 1}}
};
// --- END_TEST_CASES ---

// Include your solution class
#include "solution.cpp"

// --- START_SOLUTION_CLASS ---
// The test runner will call run_solve. Extract parameters from input and call your solution method.
Output run_solve(Solution& solution, const Input &input) { 
    return solution.twoSum(input.first, input.second); 
}
// --- END_SOLUTION_CLASS ---
```

## 4. `solution.cpp`

This is where you actually solve the problem. Include whatever standard headers you need so that your IDE doesn't complain, and then define your `Solution` class exactly as you would on LeetCode.

```cpp
#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> numMap;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (numMap.count(complement)) {
                return {numMap[complement], i};
            }
            numMap[nums[i]] = i;
        }
        return {};
    }
};
```

## 5. Running and Testing

Once your files are in place, the problem will automatically be picked up.

To test your code and generate the results for the frontend:
```bash
./run_tests.sh
```

To view it on the web app:
```bash
cd frontend
npm run dev
```
