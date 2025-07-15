#include "gtest/gtest.h"
#include "../src/0001_two_sum/solution.cpp" // Include the solution

// Test fixture for the Two Sum problem
TEST(TwoSumTest, Example1) {
    Solution s;
    std::vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    std::vector<int> expected = {0, 1};
    ASSERT_EQ(s.twoSum(nums, target), expected);
}

TEST(TwoSumTest, Example2) {
    Solution s;
    std::vector<int> nums = {3, 2, 4};
    int target = 6;
    std::vector<int> expected = {1, 2};
    ASSERT_EQ(s.twoSum(nums, target), expected);
}