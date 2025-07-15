# LeetCode Solutions (C++ & CMake)

[![C++](https://img.shields.io/badge/c%2B%2B-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white)](https://isocpp.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge&logo=mit&logoColor=white)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/Suyash8/dsa-leetcode.svg?style=for-the-badge)](https://github.com/Suyash8/dsa-leetcode/commits/develop)
[![GitHub License](https://img.shields.io/github/license/Suyash8/dsa-leetcode.svg?style=for-the-badge)](https://github.com/Suyash8/dsa-leetcode/blob/develop/LICENSE)

This repository serves as a robust and automated environment for solving LeetCode problems using C++ and CMake, with integrated GoogleTest for comprehensive testing.

## Features

*   **Automated Test Discovery:** Simply add your `solution.cpp` file for a problem, and the build system automatically discovers and runs its tests.
*   **Concise Test Output:** Get clear, summarized results for passing tests, with detailed output only for failures.
*   **Performance Metrics:** Each test run reports execution time and memory usage (VmRSS on Linux).
*   **Standardized Structure:** Follows a clean, scalable project layout for easy navigation and maintenance.
*   **GoogleTest Integration:** GoogleTest is automatically fetched and configured by CMake, no manual installation required.

## Getting Started

### Prerequisites

*   A C++ compiler (e.g., GCC, Clang) that supports C++17.
*   CMake (version 3.14 or higher).
*   Git.

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Suyash8/dsa-leetcode.git
    cd dsa-leetcode
    ```

2.  **Build the project:**
    The first build will download GoogleTest and configure the project.
    ```bash
    ./run_tests.sh
    ```
    This script will handle `cmake -S . -B build`, `cmake --build build`, and `ctest -V` for you, including retries if the build directory needs to be recreated.

## How to Add a New Problem

1.  **Create a new directory for the problem:**
    In the `src/` directory, create a new subdirectory for your problem. The name of this directory will be used as the identifier for the test in `ctest`.
    
    **Design Choice:** You can name this directory anything you like (e.g., `0001`, `0001-two-sum`, `my-first-problem`). However, it's highly recommended to include the LeetCode problem number (e.g., `src/0001/` or `src/0001-two-sum/`) for clarity and easy identification.
    
    Example:
    ```bash
    mkdir src/1108-defanging-an-ip-address
    # or simply:
    # mkdir src/1108
    ```

2.  **Create `solution.cpp`:**
    Inside the new directory (`src/N/` or `src/N-problem-name/`), create a file named `solution.cpp`.
    ```bash
    touch src/1108-defanging-an-ip-address/solution.cpp
    ```

3.  **Populate `solution.cpp`:**
    Your `solution.cpp` file must follow this structure:

    *   **Includes:** Add any necessary headers for your solution.
    *   **Problem-Specific Data Structures:** Define any custom data structures (e.g., `ListNode`, `TreeNode`) required by the problem.
    *   **Helper Functions (Optional):** Include helper functions to convert between problem-specific data structures and standard C++ containers for easier test case definition (e.g., `createList`, `listToVector`).
    *   **`Input`, `Output`, `TestCase` Type Aliases:** Define `Input` and `Output` types based on the LeetCode problem's function signature. Use `std::tuple` for multiple input parameters. `TestCase` should be `std::pair<Input, Output>`.
    *   **`test_cases` Vector:** Populate a `static const std::vector<TestCase> test_cases` with your input/expected output pairs.
    *   **`Solution` Class:**
        *   Implement the original LeetCode method (e.g., `defangIPaddr` for problem 1108).
        *   Implement a `Output solve(Input input)` wrapper method. This method will unpack the `Input` tuple and call your original LeetCode method.

    ```cpp
    // Example structure for src/N/solution.cpp

    #include <vector>
    #include <string>
    #include <tuple>
    // ... other includes

    // Problem-specific data structures (if any)
    // struct ListNode { ... };

    // Helper functions for test cases (if any)
    // ListNode* createList(const std::vector<int>& vals) { ... }

    // Test Case Type Definitions
    using Input = std::string; // Adjust based on problem
    using Output = std::string; // Adjust based on problem
    using TestCase = std::pair<Input, Output>;

    // Test Cases
    static const std::vector<TestCase> test_cases = {
        {"1.1.1.1", "1[.]1[.]1[.]1"},
        // ... more test cases
    };

    class Solution {
    public:
        // Original LeetCode method signature
        std::string defangIPaddr(std::string address) {
            // Your solution logic
            std::string result = "";
            for (char c : address) {
                if (c == '.') {
                    result += "[.]";
                } else {
                    result += c;
                }
            }
            return result;
        }

        // Wrapper method for generic test runner
        Output solve(Input input) {
            // Unpack input if it's a tuple, then call your LeetCode method
            return defangIPaddr(input);
        }
    };
    ```

4.  **Run Tests:**
    Execute the `run_tests.sh` script from the root of your repository.
    ```bash
    ./run_tests.sh
    ```
    The system will automatically detect your new solution, compile it, and run all its test cases, providing concise output.

## Git Workflow

It's recommended to follow a feature branch workflow for each problem:

1.  `git checkout develop`
2.  `git checkout -b feat/N-problem-name` (e.g., `feat/0002-add-two-numbers`)
3.  Implement your solution and test cases in `src/N/solution.cpp`.
4.  Run `./run_tests.sh` to verify.
5.  `git add src/N/solution.cpp`
6.  `git commit -m "feat(N): solve Problem Name"`
7.  `git checkout develop`
8.  `git merge --no-ff feat/N-problem-name`
9.  `git branch -d feat/N-problem-name`
10. `git push origin develop` (or `git push -u origin develop` for the first time)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.