from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import tracking, stats, logs, suggestions, ai_emissions, chat, optimization
from app.database import engine, Base
from app.services import carbon_tracker, system_monitor

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Green AI Monitor Backend", version="1.0.0")

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tracking.router, prefix="/api/v1/tracking", tags=["tracking"])
app.include_router(stats.router, prefix="/api/v1/stats", tags=["stats"])
app.include_router(logs.router, prefix="/api/v1/logs", tags=["logs"])
app.include_router(suggestions.router, prefix="/api/v1/suggestions", tags=["suggestions"])
app.include_router(ai_emissions.router, prefix="/api/v1/emissions", tags=["ai_emissions"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])
app.include_router(optimization.router, prefix="/api/v1/optimization", tags=["optimization"])

@app.get("/")
def read_root():
    return {"message": "Green AI Monitor Backend API"}

@app.on_event("startup")
async def startup_event():
    # Start carbon tracking and system monitoring on startup
    carbon_tracker.start_tracking("Green AI Monitor Backend")
    system_monitor.start_monitoring("Green AI Monitor Backend")

@app.on_event("shutdown")
async def shutdown_event():
    # Stop tracking on shutdown
    carbon_tracker.stop_tracking()
    system_monitor.stop_monitoring()