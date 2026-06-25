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
};
