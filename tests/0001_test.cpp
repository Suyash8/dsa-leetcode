#include "gtest/gtest.h"
#include "../src/0001/solution.cpp" // Include the solution
#include <chrono>
#include <iostream>

// A helper function to print test metadata
void printTestInfo(const std::string& test_name, std::chrono::duration<double, std::milli> duration) {
    std::cout << "[   INFO   ] " << test_name << " finished in " << duration.count() << " ms." << std::endl;
    // Memory usage measurement is complex and platform-specific.
    // LeetCode's online judge is the best place for this.
    // Placeholder: std::cout << "[   INFO   ] Memory usage: X MB" << std::endl;
}

// Test fixture for the Two Sum problem
TEST(TwoSumTest, Example1) {
    Solution s;
    std::vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    std::vector<int> expected = {0, 1};

    auto start = std::chrono::high_resolution_clock::now();
    std::vector<int> result = s.twoSum(nums, target);
    auto end = std::chrono::high_resolution_clock::now();
    
    ASSERT_EQ(result, expected);
    printTestInfo("TwoSumTest.Example1", end - start);
}

TEST(TwoSumTest, Example2) {
    Solution s;
    std::vector<int> nums = {3, 2, 4};
    int target = 6;
    std::vector<int> expected = {1, 2};

    auto start = std::chrono::high_resolution_clock::now();
    std::vector<int> result = s.twoSum(nums, target);
    auto end = std::chrono::high_resolution_clock::now();

    ASSERT_EQ(result, expected);
    printTestInfo("TwoSumTest.Example2", end - start);
}