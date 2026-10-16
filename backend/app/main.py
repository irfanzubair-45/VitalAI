import sys, os
# Ensure the `app` package can be imported when running from the project root
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import router as api_router
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Vital AI: Medical Report Understanding & Consultation Prep Engine",
    docs_url="/docs",
    redoc_url="/redoc",
)

from fastapi.staticfiles import StaticFiles

# Mount React build for the website
app.mount("/", StaticFiles(directory="frontend/build", html=True), name="frontend")

# CORS setup for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API endpoints under /api
app.include_router(api_router, prefix=settings.API_PREFIX)


@app.get("/")
def root():
    return {
        "message": "Welcome to Vital AI API",
        "docs": "/docs",
        "health": f"{settings.API_PREFIX}/health",
    }

