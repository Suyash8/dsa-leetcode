#include "gtest/gtest.h"
#include <chrono>
#include <iostream>
#include <string>
#include <vector>
#include <tuple>

#if defined(__linux__)
#include <fstream>
#include <unistd.h>
#endif

// --- Include the Solution File ---
// This macro will be defined by CMake to point to the specific solution.cpp file
#include SOLUTION_FILE_PATH

// --- Forward Declarations (no longer needed for Solution class) ---
// These will be defined in the solution.cpp file that is compiled with this runner.
// class Solution; // No longer needed, as solution.cpp is included
using Input = std::tuple<std::vector<int>, int>;
using Output = std::vector<int>;
using TestCase = std::pair<Input, Output>;
extern const std::vector<TestCase> test_cases;

#if defined(__linux__)
long getMemoryUsage() {
    std::ifstream status("/proc/self/status");
    std::string line;
    long vmRss = 0;
    while (std::getline(status, line)) {
        if (line.rfind("VmRSS:", 0) == 0) {
            vmRss = std::stol(line.substr(line.find(":") + 1, line.rfind("kB") - line.find(":") - 1));
            break;
        }
    }
    return vmRss;
}
#endif

// --- Test Fixture ---
// This is a parameterized test fixture. GoogleTest will run it for each test case.
class LeetCodeTest : public ::testing::TestWithParam<TestCase> {
protected:
    Solution solution;
};

// --- The Actual Test ---
TEST_P(LeetCodeTest, SolvesProblem) {
    // Get the current test case
    const auto& test_case = GetParam();
    auto [input, expected_output] = test_case;

    // Unpack the input tuple
    auto [nums, target] = input;

    // Run the solution and measure performance
    auto start = std::chrono::high_resolution_clock::now();
    Output result = solution.solve(nums, target);
    auto end = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double, std::milli> duration = end - start;

    // Assert correctness and print info
    ASSERT_EQ(result, expected_output);

    std::cout << "[   INFO   ] Test case finished in " << duration.count() << " ms." << std::endl;
#if defined(__linux__)
    std::cout << "[   INFO   ] Memory usage (VmRSS): " << getMemoryUsage() << " kB" << std::endl;
#endif
}

// --- Test Instantiation ---
// This tells GoogleTest to create the tests based on the test_cases vector.
INSTANTIATE_TEST_SUITE_P(
    Default, 
    LeetCodeTest, 
    ::testing::ValuesIn(test_cases)
);