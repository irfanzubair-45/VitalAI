# Dockerfile for VitalAI website
# Stage 1: build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: runtime for FastAPI backend
FROM python:3.11-slim AS backend
WORKDIR /app
# Install system dependencies for torch (if needed) – using CPU only
RUN apt-get update && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*
# Copy backend requirements and install
COPY backend/requirements.txt ./requirements.txt
RUN python -m venv /opt/venv && \
    /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install -r requirements.txt
# Copy backend source
COPY backend/ ./backend
# Copy built frontend from previous stage
COPY --from=frontend-builder /app/frontend/build ./frontend/build
# Expose port for FastAPI
EXPOSE 8000
# Entrypoint runs uvicorn using the venv
ENV PATH="/opt/venv/bin:$PATH"
CMD ["uvicorn", "backend/app/main:app", "--host", "0.0.0.0", "--port", "8000"]

