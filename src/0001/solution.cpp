
#include <vector>
#include <unordered_map>
#include <tuple>

// --- Test Cases ---
// Each test case is a pair of (input, expected_output)
// The input is a tuple to support multiple arguments
using Input = std::tuple<std::vector<int>, int>;
using Output = std::vector<int>;
using TestCase = std::pair<Input, Output>;

// We use a static block to define the test cases
static const std::vector<TestCase> test_cases = {
    {std::make_tuple(std::vector<int>{2, 7, 11, 15}, 9), {0, 1}},
    {std::make_tuple(std::vector<int>{3, 2, 4}, 6), {1, 2}},
    {std::make_tuple(std::vector<int>{3, 3}, 6), {0, 1}},
};

// --- Solution ---
class Solution {
public:
    // The method to be tested
    std::vector<int> solve(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (map.count(complement)) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};
