#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR/backend"

echo "=== Starting Vital AI Backend ==="

# Check/Create virtualenv
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment in backend/venv..."
    python3 -m venv venv
fi

source venv/bin/activate

echo "Installing/verifying backend dependencies..."
pip install -r requirements.txt

echo "Starting FastAPI server on http://localhost:8000..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

