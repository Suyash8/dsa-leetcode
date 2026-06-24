#include "gtest/gtest.h"
#include <chrono>
#include <fstream>
#include <iostream>
#include <numeric>
#include <sstream>
#include <string>
#include <tuple>
#include <vector>

#if defined(__linux__)
#include <unistd.h>
#endif

// --- Include the Solution File ---
// This macro will be defined by CMake to point to the specific solution.cpp file
#include SOLUTION_FILE_PATH

// --- Compile-time Problem Identity ---
// These macros are defined by CMake
#ifndef PROBLEM_NAME_STR
#define PROBLEM_NAME_STR "unknown"
#endif

#ifndef RESULTS_OUTPUT_DIR_STR
#define RESULTS_OUTPUT_DIR_STR "."
#endif

// --- Forward Declarations ---
// These types are defined in the solution.cpp file that is compiled with this runner.
using Input = decltype(test_cases[0].first);
using Output = decltype(test_cases[0].second);
using TestCase = std::pair<Input, Output>;
extern const std::vector<TestCase> test_cases;

#include <new>
#include <cstdlib>
#include <atomic>

struct MemoryStats {
    std::atomic<size_t> current_allocated{0};
    std::atomic<size_t> peak_allocated{0};
};

MemoryStats g_mem_stats;

void* operator new(size_t size) {
    size_t* ptr = (size_t*)std::malloc(size + sizeof(size_t));
    if (!ptr) throw std::bad_alloc();
    *ptr = size;
    
    g_mem_stats.current_allocated += size;
    if (g_mem_stats.current_allocated > g_mem_stats.peak_allocated) {
        g_mem_stats.peak_allocated = g_mem_stats.current_allocated.load();
    }
    
    return ptr + 1;
}

void operator delete(void* p) noexcept {
    if (!p) return;
    size_t* ptr = (size_t*)p - 1;
    size_t size = *ptr;
    g_mem_stats.current_allocated -= size;
    std::free(ptr);
}

void operator delete(void* p, size_t size) noexcept {
    if (!p) return;
    size_t* ptr = (size_t*)p - 1;
    g_mem_stats.current_allocated -= size;
    std::free(ptr);
}

void* operator new[](size_t size) { return operator new(size); }
void operator delete[](void* p) noexcept { operator delete(p); }
void operator delete[](void* p, size_t size) noexcept { operator delete(p, size); }

// --- Per-test-case result storage ---
struct TestCaseResult {
    int index;
    bool passed;
    double runtime_ms;
    long memory_bytes;
};

// Global storage for results — populated by the listener, written at program end
static std::vector<TestCaseResult> g_test_results;
static int g_current_test_index = 0;

// --- Custom GoogleTest Listener ---
class JsonResultListener : public ::testing::EmptyTestEventListener {
private:
    std::chrono::high_resolution_clock::time_point suite_start_time_;
    std::chrono::high_resolution_clock::time_point test_start_time_;
    long test_start_memory_ = 0;
    int passed_tests_count_ = 0;
    int failed_tests_count_ = 0;

public:
    void OnTestSuiteStart(const ::testing::TestSuite& test_suite) override {
        suite_start_time_ = std::chrono::high_resolution_clock::now();
        std::cout << "Running tests for problem " << test_suite.name() << std::endl;
    }

    void OnTestStart(const ::testing::TestInfo& /*test_info*/) override {
        test_start_time_ = std::chrono::high_resolution_clock::now();
        g_mem_stats.peak_allocated = g_mem_stats.current_allocated.load();
        test_start_memory_ = g_mem_stats.current_allocated.load();
    }

    void OnTestEnd(const ::testing::TestInfo& test_info) override {
        auto end_time = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double, std::milli> duration = end_time - test_start_time_;

        long memory_bytes = 0;
        size_t peak = g_mem_stats.peak_allocated.load();
        if (peak > test_start_memory_) {
            memory_bytes = peak - test_start_memory_;
        }

        bool passed = test_info.result()->Passed();
        if (passed) {
            passed_tests_count_++;
        } else {
            failed_tests_count_++;
        }

        TestCaseResult result;
        result.index = g_current_test_index++;
        result.passed = passed;
        result.runtime_ms = duration.count();
        result.memory_bytes = memory_bytes;
        g_test_results.push_back(result);
    }

    void OnTestSuiteEnd(const ::testing::TestSuite& /*test_suite*/) override {
        auto end_time = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double, std::milli> duration = end_time - suite_start_time_;

        std::cout << "  " << passed_tests_count_ << "/" << (passed_tests_count_ + failed_tests_count_) << " tests passed. ";
        std::cout << "Total time: " << duration.count() << " ms.";

        long end_memory = g_mem_stats.current_allocated.load();
        std::cout << " Total heap memory: " << end_memory << " bytes.";
        std::cout << std::endl;
    }
};

// --- Helper: Escape a string for JSON ---
static std::string jsonEscape(const std::string& s) {
    std::ostringstream oss;
    for (char c : s) {
        switch (c) {
            case '"':  oss << "\\\""; break;
            case '\\': oss << "\\\\"; break;
            case '\n': oss << "\\n"; break;
            case '\r': oss << "\\r"; break;
            case '\t': oss << "\\t"; break;
            default:   oss << c; break;
        }
    }
    return oss.str();
}

// --- Write results JSON ---
static void writeResultsJson() {
    std::string problem_name = PROBLEM_NAME_STR;
    std::string output_dir = RESULTS_OUTPUT_DIR_STR;
    std::string filepath = output_dir + "/" + problem_name + "_results.json";

    int total = static_cast<int>(g_test_results.size());
    int passed = 0;
    int failed = 0;
    double total_runtime = 0.0;
    double max_runtime = 0.0;
    long max_memory = 0;

    for (const auto& r : g_test_results) {
        if (r.passed) passed++;
        else failed++;
        total_runtime += r.runtime_ms;
        if (r.runtime_ms > max_runtime) max_runtime = r.runtime_ms;
        if (r.memory_bytes > max_memory) max_memory = r.memory_bytes;
    }

    double avg_runtime = total > 0 ? total_runtime / total : 0.0;

    std::ofstream out(filepath);
    if (!out.is_open()) {
        std::cerr << "ERROR: Could not write results to " << filepath << std::endl;
        return;
    }

    out << "{\n";
    out << "  \"problem_id\": \"" << jsonEscape(problem_name) << "\",\n";
    out << "  \"total_tests\": " << total << ",\n";
    out << "  \"passed_tests\": " << passed << ",\n";
    out << "  \"failed_tests\": " << failed << ",\n";
    out << "  \"total_runtime_ms\": " << total_runtime << ",\n";
    out << "  \"average_runtime_ms\": " << avg_runtime << ",\n";
    out << "  \"max_runtime_ms\": " << max_runtime << ",\n";
    out << "  \"total_memory_bytes\": " << max_memory << ",\n";
    out << "  \"test_results\": [\n";

    for (size_t i = 0; i < g_test_results.size(); ++i) {
        const auto& r = g_test_results[i];
        out << "    {\n";
        out << "      \"index\": " << r.index << ",\n";
        out << "      \"passed\": " << (r.passed ? "true" : "false") << ",\n";
        out << "      \"runtime_ms\": " << r.runtime_ms << ",\n";
        out << "      \"memory_bytes\": " << r.memory_bytes << "\n";
        out << "    }";
        if (i + 1 < g_test_results.size()) out << ",";
        out << "\n";
    }

    out << "  ]\n";
    out << "}\n";
    out.close();
}

// --- Test Fixture ---
class LeetCodeTest : public ::testing::TestWithParam<TestCase> {
protected:
    Solution solution;
};

// --- The Actual Test ---
TEST_P(LeetCodeTest, SolvesProblem) {
    const auto& test_case = GetParam();
    auto [input, expected_output] = test_case;

    Output result = solution.solve(input);

    ASSERT_EQ(result, expected_output);
}

// --- Test Instantiation ---
INSTANTIATE_TEST_SUITE_P(
    Default, 
    LeetCodeTest, 
    ::testing::ValuesIn(test_cases)
);

// --- Main function ---
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);

    // Remove the default console output listener to replace it with our custom one.
    ::testing::TestEventListeners& listeners = ::testing::UnitTest::GetInstance()->listeners();
    delete listeners.Release(listeners.default_result_printer());
    listeners.Append(new JsonResultListener);

    int result = RUN_ALL_TESTS();

    // Write the JSON results file after all tests complete
    writeResultsJson();

    return result;
}