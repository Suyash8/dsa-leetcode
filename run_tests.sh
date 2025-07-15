#!/bin/bash

BUILD_DIR="build"

# Function to perform the build and test steps
perform_build_and_test() {
    echo "--- Configuring CMake ---"
    cmake -S . -B "$BUILD_DIR"
    if [ $? -ne 0 ]; then
        echo "CMake configuration failed. Exiting."
        return 1 # Indicate failure
    fi

    echo "--- Building Project ---"
    cmake --build "$BUILD_DIR"
    if [ $? -ne 0 ]; then
        echo "Compilation failed."
        return 1 # Indicate compilation failure
    fi

    echo "--- Running Tests ---"
    # Ensure we are in the build directory to run ctest
    (cd "$BUILD_DIR" && ctest -V)
    if [ $? -ne 0 ]; then
        echo "Tests failed."
        return 1 # Indicate test failure
    fi

    return 0 # Indicate success
}

# Main execution flow
if perform_build_and_test; then
    echo "Build and tests completed successfully."
else
    echo "Attempting to clean and retry..."
    rm -rf "$BUILD_DIR"
    if perform_build_and_test; then
        echo "Build and tests completed successfully after retry."
    else
        echo "Build and tests failed after retry. Please check the errors above."
        exit 1
    fi
fi
