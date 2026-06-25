#include <vector>
#include <string>
#include <sstream>

class Solution {
public:
  bool isValid(std::string word) {
    if (word.size() < 3)
      return false;

    bool vowel = false, consonant = false;
    for (const auto &ch : word) {
      bool curr_vowel = ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' ||
                        ch == 'u' || ch == 'A' || ch == 'E' || ch == 'I' ||
                        ch == 'O' || ch == 'U';
      vowel = curr_vowel || vowel;

      bool curr_cons = curr_vowel
                           ? false
                           : (ch > 'a' && ch <= 'z') || (ch > 'A' && ch <= 'Z');
      consonant = curr_cons || consonant;

      if (curr_cons || curr_vowel || (ch >= '0' && ch <= '9'))
        continue;
      return false;
    }

    if (!vowel || !consonant)
      return false;
    return true;
  }
};
