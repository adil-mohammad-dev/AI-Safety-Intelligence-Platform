from fastapi import FastAPI

from app.core.config import settings
from app.core.database import Base, engine
from app.models.user_model import User
from app.routes.auth_route import router as auth_router
from app.models.video_model import Video
from app.routes.video_route import router as video_router
from app.models.incident_model import Incident
from app.routes.incident_route import router as incident_router
from app.routes.dashboard_route import router as dashboard_router
from app.models.report_model import IncidentReport
from app.routes.report_route import router as report_router
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered workplace safety monitoring platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(video_router)
app.include_router(incident_router)
app.include_router(dashboard_router)
app.include_router(report_router)


@app.get("/")
def root():
    return {
        "status": "running",
        "message": "Safety Intelligence Platform Backend Running"
    }


@app.get("/health")
def health_check():
    return {
        "server": "healthy",
        "database": "connected"
    }