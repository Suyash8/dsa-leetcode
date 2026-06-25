class Solution {
public:
  int sumOfTheDigitsOfHarshadNumber(int x) {
    int sum = 0, num = x;
    while (num != 0) {
      int remainder = num % 10;
      num /= 10;
      sum += remainder;
    }
    return x % sum == 0 ? sum : -1;
  }
};
