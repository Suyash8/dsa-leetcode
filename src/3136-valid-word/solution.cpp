#include <string>
#include <vector>

using Input = std::string;
using Output = bool;
using TestCase = std::pair<Input, Output>;

static const std::vector<TestCase> test_cases = {
    // ---- minimal length edge cases ----
    {"a", false},  // length < 3
    {"ab", false}, // length < 3
    {"abc", true}, // a=vowel, b/c consonant, valid

    // ---- only vowels (invalid because no consonant) ----
    {"aaa", false},
    {"AEI", false},
    {"aAo", false},

    // ---- only consonants (invalid because no vowel) ----
    {"bbb", false},
    {"xyz", false},
    {"BCd", false},

    // ---- vowels and consonants mixed (valid) ----
    {"abz", true}, // a=vowel, b/c consonant
    {"aBc", true}, // mixed case
    {"IOp", true}, // I/O vowels, p consonant
    {"uZ9", true}, // u=vowel, Z=consonant, digit allowed
    {"9pE", true}, // p=consonant, E=vowel, digit allowed

    // ---- includes digits only (must still satisfy vowel+consonant) ----
    {"a1b", true},    // a=vowel, b=consonant
    {"1a2", false},   // only vowel a, no consonant
    {"1b2", false},   // only consonant b, no vowel
    {"a1b2c3", true}, // mixed with digits
    {"9Zz", false},   // no vowel
    {"9Za", true},    // Z=consonant, a=vowel, valid

    // ---- invalid characters (symbols) ----
    {"ab!", false}, // ! not allowed
    {"a$c", false}, // $ not allowed
    {"a_c", false}, // _ not allowed

    // ---- edge with upper and lower mix ----
    {"AaB", true},  // A vowel, B consonant
    {"XyZ", false}, // all consonants
    {"OoP", true},  // O vowel, P consonant
    {"U9T", true},  // U vowel, T consonant

    // ---- longer valid cases ----
    {"abcdefgh", true},   // has vowels (a,e) and consonants (b,c,d,f,g,h)
    {"AEIOUbcd", true},   // uppercase vowels and lowercase consonants
    {"123aei456", false}, // only vowels, no consonant
    {"123bcd456", false}, // only consonants, no vowel
    {"123aeiB456", true}, // vowel+consonant, with digits
    {"9Aa", false},       // A and a are vowels, no consonant
    {"9AaZ", true},       // A vowel, Z consonant
    {"0aB1", true},       // a vowel, B consonant
    {"0A1E", false},      // only vowels, no consonant
    {"AbC", true},        // A vowel, b/c consonant
    {"bCa", true},        // b consonant, C consonant, a vowel
    {"bCd", false},       // all consonants
    {"aEe", false},       // all vowels
    {"A1c", true},        // A vowel, c consonant
    {"c1A", true},        // c consonant, A vowel
    {"Z9y", false},       // Z consonant, y consonant, no vowel
    {"U9t", true},        // U vowel, t consonant
    {"pQr", false},       // all consonants
    {"oPq", true},        // o vowel, P consonant
};

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

  Output solve(const Input &input) { return isValid(input); }
};
