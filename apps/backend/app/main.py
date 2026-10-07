from __future__ import annotations

from fastapi import FastAPI

from app.api.v1.agent_config import router as agent_config_router
from app.api.v1.agents import router as agents_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.tasks import router as tasks_router
from app.core.config import settings

app = FastAPI(
    title="AI Tech Team Company API",
    version="0.1.0",
    description="Backend for the AI tech team company platform",
)

app.include_router(agents_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")
app.include_router(tasks_router, prefix="/api/v1")
app.include_router(agent_config_router, prefix="/api/v1")


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok", "service": settings.app_name}


@app.get("/")
def root() -> dict:
    return {"message": "AI Tech Team Company backend is online."}
