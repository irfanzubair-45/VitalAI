#!/usr/bin/env bash
set -e

export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR/frontend"

echo "=== Starting Vital AI Frontend ==="

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies (npm install)..."
    npm install
fi

echo "Launching Vite dev server on http://localhost:5173..."
npm run dev

