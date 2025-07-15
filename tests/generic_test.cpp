#include "gtest/gtest.h"
#include <chrono>
#include <iostream>
#include <string>
#include <vector>
#include <tuple>
#include <numeric>

#if defined(__linux__)
#include <fstream>
#include <unistd.h>
#endif

// --- Include the Solution File ---
// This macro will be defined by CMake to point to the specific solution.cpp file
#include SOLUTION_FILE_PATH

// --- Forward Declarations ---
// These types are defined in the solution.cpp file that is compiled with this runner.
// We declare them here so the test fixture can use them.
using Input = decltype(test_cases[0].first);
using Output = decltype(test_cases[0].second);
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

// --- Custom GoogleTest Listener ---
class ConciseTestListener : public ::testing::EmptyTestEventListener {
private:
    std::chrono::high_resolution_clock::time_point suite_start_time_;
    long suite_start_memory_;
    int passed_tests_count_ = 0;
    int failed_tests_count_ = 0;

public:
    void OnTestSuiteStart(const ::testing::TestSuite& test_suite) override {
        suite_start_time_ = std::chrono::high_resolution_clock::now();
#if defined(__linux__)
        suite_start_memory_ = getMemoryUsage();
#endif
        std::cout << "Running tests for problem " << test_suite.name() << std::endl;
    }

    void OnTestEnd(const ::testing::TestInfo& test_info) override {
        if (test_info.result()->Passed()) {
            passed_tests_count_++;
        } else {
            failed_tests_count_++;
            // For failed tests, GoogleTest's default output is usually sufficient and detailed.
            // We just need to ensure it's not suppressed.
        }
    }

    void OnTestSuiteEnd(const ::testing::TestSuite& test_suite) override {
        auto end_time = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double, std::milli> duration = end_time - suite_start_time_;

        std::cout << "  " << passed_tests_count_ << "/" << (passed_tests_count_ + failed_tests_count_) << " tests passed. ";
        std::cout << "Total time: " << duration.count() << " ms.";

#if defined(__linux__)
        long end_memory = getMemoryUsage();
        std::cout << " Total memory (VmRSS): " << end_memory << " kB.";
#endif
        std::cout << std::endl;
    }
};

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

    // Run the solution
    Output result = solution.solve(input);

    // Assert correctness
    ASSERT_EQ(result, expected_output);
}

// --- Test Instantiation ---
// This tells GoogleTest to create the tests based on the test_cases vector.
INSTANTIATE_TEST_SUITE_P(
    Default, 
    LeetCodeTest, 
    ::testing::ValuesIn(test_cases)
);

// --- Main function to register the custom listener ---
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);

    // Remove the default console output listener to replace it with our custom one.
    ::testing::TestEventListeners& listeners = ::testing::UnitTest::GetInstance()->listeners();
    delete listeners.Release(listeners.default_result_printer());
    listeners.Append(new ConciseTestListener);

    return RUN_ALL_TESTS();
}