# /home/illionar/Projects/dsa-leetcode/tests/CMakeLists.txt

# Find all test files
file(GLOB test_files "*_test.cpp")

# Create an executable for our tests from all the found test files
add_executable(run_tests ${test_files})

# Link our tests against our solutions library and GoogleTest
target_link_libraries(run_tests PRIVATE leetcode_solutions gtest_main)

# --- Test Discovery ---
# Automatically discover all tests in our executable
include(GoogleTest)
gtest_discover_tests(run_tests)