#include <vector>

class Solution {
public:
  std::vector<int> runningSum(std::vector<int> &nums) {
    if (nums.empty())
      return {};
    std::vector<int> ret;
    ret.reserve(nums.size());
    ret.push_back(nums.at(0));
    for (size_t i = 1; i < nums.size(); ++i)
      ret.push_back(nums[i] + ret[i - 1]);
    return ret;
  }
};
