#!/bin/bash

# Library Management System - Backend Setup Script
# This script helps install required dependencies and download necessary libraries

set -e

echo "=================================="
echo "Library Management System - Backend Setup"
echo "=================================="

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Detected: Linux"
    
    echo "Installing dependencies..."
    sudo apt-get update
    sudo apt-get install -y \
        cmake \
        build-essential \
        libmysqlclient-dev \
        libboost-all-dev \
        nlohmann-json3-dev \
        git
    
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Detected: macOS"
    
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        echo "Homebrew not found. Please install Homebrew first:"
        echo "/bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    
    echo "Installing dependencies..."
    brew install cmake mysql boost nlohmann-json
    
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    echo "Detected: Windows"
    echo "For Windows, please use vcpkg to install dependencies:"
    echo "  vcpkg install mysql:x64-windows boost:x64-windows nlohmann-json:x64-windows"
    exit 1
else
    echo "Unknown OS: $OSTYPE"
    exit 1
fi

# Create third_party directory if it doesn't exist
mkdir -p third_party

# Download Crow framework if not already present
if [ ! -f "third_party/crow_all.h" ]; then
    echo "Downloading Crow framework..."
    cd third_party
    
    # Download the latest crow_all.h
    curl -L -o crow_all.h https://github.com/CrowCpp/Crow/releases/download/v1.0%2B5/crow_all.h
    
    if [ $? -eq 0 ]; then
        echo "✓ Crow framework downloaded successfully"
    else
        echo "✗ Failed to download Crow framework"
        echo "Please download manually from: https://github.com/CrowCpp/Crow/releases"
        exit 1
    fi
    
    cd ..
else
    echo "✓ Crow framework already present"
fi

# Create build directory
echo "Creating build directory..."
mkdir -p build
cd build

# Run CMake
echo "Running CMake..."
cmake ..

# Show build instructions
echo ""
echo "=================================="
echo "Setup Complete!"
echo "=================================="
echo ""
echo "To build the project, run:"
echo "  cd build"
echo "  cmake --build . --config Release"
echo ""
echo "Or using make:"
echo "  make -j$(nproc)"
echo ""
echo "To start the server after building:"
echo "  ./library_server"
echo ""
echo "Make sure MySQL server is running and the database is set up:"
echo "  mysql -u root -p < ../sql/schema.sql"
echo ""
