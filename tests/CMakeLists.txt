# This script automatically finds LeetCode solutions and creates a separate test for each one.

# Find the generic test runner template
set(GENERIC_TEST_RUNNER "${CMAKE_CURRENT_SOURCE_DIR}/generic_test.cpp")

# Find all solution.cpp files in the src directory
file(GLOB_RECURSE solution_files "${CMAKE_SOURCE_DIR}/src/*/solution.cpp")

# Loop through each found solution file
foreach(solution_file ${solution_files})
    # Extract the problem number (the directory name)
    get_filename_component(problem_dir ${solution_file} DIRECTORY)
    get_filename_component(problem_name ${problem_dir} NAME)

    # Define the name of the test executable
    set(test_name "test_${problem_name}")

    # Create a new executable for this specific problem
    # It's built from the generic runner and the specific solution file
    add_executable(${test_name} ${GENERIC_TEST_RUNNER})

    # Pass the absolute path of the solution file as a preprocessor definition
    target_compile_definitions(${test_name} PRIVATE "SOLUTION_FILE_PATH=\"${solution_file}\"")

    # Link the test against GoogleTest
    target_link_libraries(${test_name} PRIVATE gtest_main)

    # Add the new executable to the test suite using its problem name
    add_test(NAME ${problem_name} COMMAND ${test_name})
endforeach()