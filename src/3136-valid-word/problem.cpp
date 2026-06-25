#include <string>
#include <vector>

// --- START_CUSTOM_DATA_STRUCTURES ---
// No custom data structures for this problem
// --- END_CUSTOM_DATA_STRUCTURES ---

// --- START_TYPE_DEFINITIONS ---
using Input = std::string;
using Output = bool;
using TestCase = std::pair<Input, Output>;
// --- END_TYPE_DEFINITIONS ---

// --- START_TEST_CASES ---
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
// --- END_TEST_CASES ---

// --- START_SOLUTION_CLASS ---
#include "solution.cpp"

Output run_solve(Solution& solution, const Input &input) { return solution.isValid(input); }

// --- END_SOLUTION_CLASS ---