# /home/illionar/Projects/dsa-leetcode/src/CMakeLists.txt

# Create a library named 'leetcode_solutions' from all .cpp files in subdirectories.
file(GLOB_RECURSE solution_files "*/solution.cpp")
add_library(leetcode_solutions ${solution_files})