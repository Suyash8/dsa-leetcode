# Plan: Web-based LeetCode Solutions Dashboard

This plan outlines the steps to implement a web-based dashboard for your LeetCode solutions. The dashboard will display a list of problems, their runtime statistics, and allow users to view detailed information about each solution, including the code and test cases.

## Goal

Automatically generate static HTML, CSS, and JavaScript files, along with a JSON data file, that create a dashboard of all solved LeetCode problems. This generation will be triggered by the `run_tests.sh` script. The web pages will be purely client-side rendered, fetching data from the generated JSON, making them suitable for hosting on platforms like GitHub Pages.

## Key Components

1.  **Data Extraction & Processing Script (Python):** A Python script responsible for parsing C++ solution files and test results, and structuring this data into a JSON format.
2.  **Web Frontend (HTML, CSS, JavaScript):** Static HTML templates and CSS for the dashboard UI. JavaScript will fetch and render data from the generated JSON.
3.  **Integration:** Modifying the `run_tests.sh` script to trigger the web generation.

## Phase 1: Data Collection & Processing (Python Script)

**Objective:** Create a Python script that can extract all necessary information from `solution.cpp` files and test results, and output it as a structured JSON file.

**Tools:** Python (standard libraries like `os`, `json`, `re`, `pathlib`), `Jinja2` for templating (for HTML generation).

**Steps:**

1.  **Define `data.json` Schema:**
    The `data.json` file will be an array of problem objects. Each problem object will have the following structure:

    ```json
    [
      {
        "id": "string", // Problem directory name, e.g., "0001", "1108-defanging-an-ip-address"
        "title": "string", // Problem title, e.g., "Two Sum", "Defanging an IP Address"
        "difficulty": "string", // e.g., "Easy", "Medium", "Hard"
        "topics": ["string"], // e.g., ["Array", "Hash Table"]
        "description": "string", // Problem description (Markdown or plain text)
        "examples": [
          {
            "input": "string", // Example input string
            "output": "string", // Example output string
            "explanation": "string" // Optional explanation
          }
        ],
        "constraints": ["string"], // List of constraints
        "time_complexity": "string", // e.g., "O(N)", "O(log N)"
        "space_complexity": "string", // e.g., "O(1)", "O(N)"
        "language": "cpp",
        "solution_code": "string", // Extracted C++ code for the main solution class/function
        "type_definitions_code": "string", // Raw string of Input/Output/TestCase typedefs
        "custom_data_structures_code": "string", // Raw string of ListNode/TreeNode structs (if any)
        "test_cases": [
          {
            "input_code": "string", // Raw string of the input part from test_cases vector
            "expected_output_code": "string", // Raw string of the expected output part from test_cases vector
            "actual_output": "string", // String representation of actual output from test run
            "runtime_ms": "number", // Runtime for this specific test case
            "memory_kb": "number", // Memory for this specific test case
            "passed": "boolean" // Whether this test case passed
          }
        ],
        "aggregated_stats": {
          "total_test_cases": "number",
          "passed_test_cases": "number",
          "failed_test_cases": "number",
          "average_runtime_ms": "number",
          "max_runtime_ms": "number",
          "average_memory_kb": "number",
          "max_memory_kb": "number"
        }
      }
      // ... more problem objects
    ]
    ```

2.  **New `src/N/metadata.json` File:**
    Each problem directory (`src/N/`) will now contain a `metadata.json` file alongside `solution.cpp`. This file will hold the problem's static information (title, difficulty, description, etc.), including time and space complexity.

    **Example `src/1108/metadata.json`:**
    ```json
    {
      "title": "Defanging an IP Address",
      "difficulty": "Easy",
      "topics": ["String"],
      "description": "Given a valid (IPv4) IP address, return a defanged version of that IP address. A defanged IP address replaces every period \".\" with \"[.]\".",
      "examples": [
        {
          "input": "address = \"1.1.1.1\"",
          "output": "\"1[.]1[.]1[.]1\"",
          "explanation": "The input IP address is 1.1.1.1. We replace each period with \"[.]\"."
        },
        {
          "input": "address = \"255.100.50.0\"",
          "output": "\"255[.]100[.]50[.]0\""
        }
      ],
      "constraints": [
        "The given address is a valid IPv4 address."
      ],
      "time_complexity": "O(L)", // L is the length of the IP address string
      "space_complexity": "O(L)"  // L is the length of the IP address string
    }
    ```

3.  **Update `solution.cpp` Structure with Markers:**
    To enable robust parsing, each `solution.cpp` file will need to include specific markers. The Python script will read content between these markers.

    **Example `src/1108/solution.cpp` (updated structure):**
    ```cpp
    #include <string>
    #include <vector>
    #include <sstream>
    #include <tuple>

    // --- START_CUSTOM_DATA_STRUCTURES ---
    // No custom data structures for this problem
    // --- END_CUSTOM_DATA_STRUCTURES ---

    // --- START_TYPE_DEFINITIONS ---
    using Input = std::string;
    using Output = std::string;
    using TestCase = std::pair<Input, Output>;
    // --- END_TYPE_DEFINITIONS ---

    // --- START_TEST_CASES ---
    static const std::vector<TestCase> test_cases = {
        {"1.1.1.1", "1[.]1[.]1[.]1"},
        {"255.100.50.0", "255[.]100[.]50[.]0"}
    };
    // --- END_TEST_CASES ---

    // --- START_SOLUTION_CODE ---
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

      Output solve(Input input) { return defangIPaddr(input); }
    };
    // --- END_SOLUTION_CODE ---
    ```

4.  **Parse `solution.cpp` and `metadata.json`:**
    *   The Python script will iterate through `src/*/` directories.
    *   For each directory, it will:
        *   Read `metadata.json` to get `title`, `difficulty`, `topics`, `description`, `examples`, `constraints`, `time_complexity`, and `space_complexity`.
        *   Read `solution.cpp` and extract content between the defined markers for `solution_code`, `type_definitions_code`, `custom_data_structures_code`, and `test_cases` (raw `input_code` and `expected_output_code`).
        *   Extract the problem `id` from the directory name.

5.  **Modify `generic_test.cpp` for Structured Test Results Output:**
    *   Update `tests/generic_test.cpp` to output the `actual_output`, `runtime_ms`, `memory_kb`, and `passed` status for *each individual test case* to a machine-readable JSON file.
    *   The output file name should be predictable (e.g., `build/tests/test_N_results.json`).
    *   *Challenge:* Converting complex C++ types (like `std::vector<int>`, `ListNode*`) to string representations for `actual_output` in C++.

6.  **Integrate Test Results:** The Python script will read these generated JSON test result files (`build/tests/test_N_results.json`) and merge the per-test-case data into the `test_cases` array of the corresponding problem object.

7.  **Generate `data.json`:** Combine all extracted and processed problem data into a single, comprehensive JSON file (`docs/data.json`). This file will be consumed by the JavaScript frontend.

## Phase 2: Web Frontend Development

**Objective:** Design and implement the static HTML, CSS, and JavaScript for the dashboard, which will consume the generated `data.json`.

**Tools:** HTML5, CSS3, JavaScript, a syntax highlighting library (e.g., Prism.js or highlight.js).

**Steps:**

1.  **Dashboard Page (`index.html`):**
    *   A static HTML template that includes `style.css` and `script.js`.
    *   JavaScript will fetch `data.json` and dynamically populate a list of all problems, showing problem number/name, and aggregated stats (e.g., average runtime, memory).
    *   Each problem entry will link to the single detail page using a query parameter: `stats.html?id=<problem_number>`.
2.  **Problem Detail Page (`stats.html`):**
    *   A single static HTML template that includes `style.css` and `script.js`.
    *   JavaScript will:
        *   Parse the `id` query parameter from the URL (`window.location.search`).
        *   Fetch `data.json`.
        *   Find the problem data corresponding to the `id`.
        *   Dynamically display:
            *   The problem's `title`, `difficulty`, `topics`, `description`, `examples`, `constraints`, `time_complexity`, and `space_complexity`.
            *   The problem's `solution_code` (with syntax highlighting).
            *   The `type_definitions_code` and `custom_data_structures_code`.
            *   All `test_cases` in a clear, formatted table, including `input_code`, `expected_output_code`, `actual_output`, `runtime_ms`, `memory_kb`, and `passed` status.
        *   **Update the page title** (`document.title`) based on the problem name/number.
    *   *Challenge:* Representing complex C++ data structures (like `std::vector<int>`, `ListNode*`) as human-readable strings in HTML for `input_code` and `expected_output_code` if the raw code is too verbose. This might require additional JavaScript parsing or a more sophisticated C++-to-string conversion in the Python script.
3.  **Styling (`style.css`):** Create a clean, modern, and responsive design for the dashboard.
4.  **Interactivity (`script.js`):** Implement JavaScript for fetching `data.json`, dynamic rendering, navigation, and potentially client-side filtering/sorting.

## Phase 3: Integration & Automation

**Objective:** Connect the data processing and web generation with the existing build system.

**Steps:**

1.  **Create `docs/` Directory:** This will be the output directory for all generated web files, suitable for GitHub Pages.
2.  **Modify `run_tests.sh`:**
    *   After a successful `cmake --build build` and `ctest -V` run, add a call to the Python script.
    *   The Python script will execute Phase 1 (data extraction and `data.json` generation) and then use `Jinja2` (or similar) to render the HTML templates from Phase 2, placing all generated files (`index.html`, `stats.html`, `style.css`, `script.js`, `data.json`) into the `docs/` directory.
3.  **Update `.gitignore`:** Add `docs/` to `.gitignore` to prevent generated files from being committed (unless the user explicitly wants to commit them for GitHub Pages).

## Git Strategy

This is a large feature, so it will be developed on a dedicated feature branch.

*   **Branch Name:** `feature/web-dashboard`

**Commit Strategy (Incremental Development):**

1.  `feat: initial web dashboard setup (scripts, web dirs)`
2.  `refactor: update solution.cpp with parsing markers`
3.  `feat: parse solution.cpp for code and test cases`
4.  `refactor: modify generic_test.cpp for structured test results output`
5.  `feat: integrate test results parsing and data.json generation`
6.  `feat: implement basic web templates (index, stats)`
7.  `feat: generate static web files from data.json using templates`
8.  `chore: integrate web generation into run_tests.sh`
9.  `refactor: polish web dashboard UI and data presentation`
10. `docs: update README with web dashboard instructions`

## Potential Challenges & Considerations

*   **C++ Parsing Robustness:** Relying on regex for C++ parsing can be brittle. Careful design of `solution.cpp` (e.g., using specific markers for code blocks) or exploring a lightweight C++ parser library for Python might be necessary if issues arise.
*   **Complex Data Structure Visualization:** Converting `ListNode*`, `TreeNode*`, etc., into human-readable and visually appealing representations in HTML/JS will require custom logic in the Python script and potentially in JavaScript.
*   **Performance Data Granularity:** Deciding whether to show per-test-case stats or aggregated stats (average, max) on the dashboard.
*   **Error Handling:** The Python script should gracefully handle malformed `solution.cpp` files or missing test result data.

This plan provides a solid roadmap. Let me know if you'd like any adjustments or further details on specific steps.