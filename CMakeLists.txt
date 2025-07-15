# /home/illionar/Projects/dsa-leetcode/CMakeLists.txt

cmake_minimum_required(VERSION 3.14)
project(LeetCodeSolutions CXX)

# Set a modern C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# --- Dependency Management: Fetch GoogleTest ---
# This automatically downloads GoogleTest so you don't have to install it.
include(FetchContent)
FetchContent_Declare(
  googletest
  GIT_REPOSITORY https://github.com/google/googletest.git
  GIT_TAG        release-1.12.1 # A recent, stable version
)
# This makes the gtest and gtest_main targets available to us.
FetchContent_MakeAvailable(googletest)

# --- Testing Setup ---
# Enable testing for the project. This allows us to use ctest.
enable_testing()

# --- Subdirectories ---
# Add our source and test directories to the build.
add_subdirectory(src)
add_subdirectory(tests)