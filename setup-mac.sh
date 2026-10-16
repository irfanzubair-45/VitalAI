#!/usr/bin/env bash
set -e

echo "=== Vital AI: macOS Environment Setup ==="

# 1. Check for Xcode Command Line Tools
if ! xcode-select -p &>/dev/null; then
    echo "Xcode Command Line Tools not detected."
    echo "Requesting installation (a macOS prompt may appear)..."
    xcode-select --install || true
    echo "Please finish the Xcode developer tools installer if prompted, then re-run this script."
fi

# 2. Check for Homebrew
if ! command -v brew &>/dev/null; then
    echo "Homebrew is not installed. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for Apple Silicon
    if [[ $(uname -m) == 'arm64' ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
fi

# 3. Check for Node.js & npm
if ! command -v node &>/dev/null; then
    echo "Installing Node.js via Homebrew..."
    brew install node
else
    echo "Node.js detected: $(node --version)"
fi

# 4. Check for Python 3
if ! command -v python3 &>/dev/null; then
    echo "Installing Python 3 via Homebrew..."
    brew install python
else
    echo "Python detected: $(python3 --version)"
fi

echo ""
echo "=== Environment Setup Complete! ==="
echo "You can now run:"
echo "  1. ./run-backend.sh   (Starts FastAPI backend on http://localhost:8000)"
echo "  2. ./run-frontend.sh  (Starts React/Vite frontend on http://localhost:5173)"

