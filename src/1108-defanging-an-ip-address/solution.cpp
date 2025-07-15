#include <sstream>
#include <string>
#include <vector>

using Input = std::string;
using Output = std::string;
using TestCase = std::pair<Input, Output>;

static const std::vector<TestCase> test_cases = {
    // minimal segments
    {"0.0.0.0", "0[.]0[.]0[.]0"},
    {"0.0.0.1", "0[.]0[.]0[.]1"},
    {"0.0.0.9", "0[.]0[.]0[.]9"},

    // small numbers in each segment
    {"1.2.3.4", "1[.]2[.]3[.]4"},
    {"9.8.7.6", "9[.]8[.]7[.]6"},

    // double-digit numbers
    {"10.11.12.13", "10[.]11[.]12[.]13"},
    {"99.88.77.66", "99[.]88[.]77[.]66"},

    // triple-digit numbers near upper range
    {"100.101.102.103", "100[.]101[.]102[.]103"},
    {"123.45.67.89", "123[.]45[.]67[.]89"},

    // maximum values per segment
    {"255.255.255.255", "255[.]255[.]255[.]255"},

    // leading zeros in segments
    {"001.002.003.004", "001[.]002[.]003[.]004"},
    {"000.000.000.000", "000[.]000[.]000[.]000"},

    // mixed styles
    {"1.01.001.000", "1[.]01[.]001[.]000"},
    {"12.0.250.5", "12[.]0[.]250[.]5"},

    // edge near boundaries
    {"0.255.0.255", "0[.]255[.]0[.]255"},
    {"255.0.255.0", "255[.]0[.]255[.]0"},

    // random valid IPv4 patterns
    {"192.168.0.1", "192[.]168[.]0[.]1"},
    {"127.0.0.1", "127[.]0[.]0[.]1"},
    {"8.8.8.8", "8[.]8[.]8[.]8"},
    {"10.0.0.1", "10[.]0[.]0[.]1"}

};

class Solution {
public:
  std::string defangIPaddr(std::string address) {
    std::ostringstream sb;
    for (const auto &ch : address) {
      if (ch == '.')
        sb << '[' << ch << ']';
      else
        sb << ch;
    }
    return sb.str();
  }

  Output solve(const Input &input) { return defangIPaddr(input); }
};