# /home/illionar/Projects/dsa-leetcode/tests/CMakeLists.txt

# Create an executable for our tests
add_executable(run_tests
    0001_two_sum_test.cpp
    # Add new test files here, e.g., 0001_two_sum_test.cpp
)

# Link our tests against our solutions library and GoogleTest
target_link_libraries(run_tests PRIVATE leetcode_solutions gtest_main)

# --- Test Discovery ---
# Automatically discover all tests in our executable
include(GoogleTest)
gtest_discover_tests(run_tests)