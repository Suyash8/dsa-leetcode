# This script automatically finds LeetCode solutions and creates a separate test for each one.

# Find the generic test runner template
set(GENERIC_TEST_RUNNER "${CMAKE_CURRENT_SOURCE_DIR}/generic_test.cpp")

# Results output directory for JSON test results
set(RESULTS_OUTPUT_DIR "${CMAKE_BINARY_DIR}/test_results")
file(MAKE_DIRECTORY ${RESULTS_OUTPUT_DIR})

# Find all problem.cpp files in the src directory
file(GLOB_RECURSE problem_files "${CMAKE_SOURCE_DIR}/src/*/problem.cpp")

# Loop through each found problem file
foreach(problem_file ${problem_files})
    # Extract the problem number (the directory name)
    get_filename_component(problem_dir ${problem_file} DIRECTORY)
    get_filename_component(problem_name ${problem_dir} NAME)

    # Define the name of the test executable
    set(test_name "test_${problem_name}")

    # Create a new executable for this specific problem
    # It's built from the generic runner and the specific solution file
    add_executable(${test_name} ${GENERIC_TEST_RUNNER})

    # Pass the absolute path of the problem file as a preprocessor definition
    target_compile_definitions(${test_name} PRIVATE
        "PROBLEM_FILE_PATH=\"${problem_file}\""
        "PROBLEM_NAME_STR=\"${problem_name}\""
        "RESULTS_OUTPUT_DIR_STR=\"${RESULTS_OUTPUT_DIR}\""
    )

    # Link the test against GoogleTest
    target_link_libraries(${test_name} PRIVATE gtest_main)

    # Add the new executable to the test suite using its problem name
    add_test(NAME ${problem_name} COMMAND ${test_name})
endforeach()