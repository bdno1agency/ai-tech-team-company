from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.agents import router as agents_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.tasks import router as tasks_router
from app.core.config import settings

app = FastAPI(
    title="AI Tech Team Company API",
    version="0.1.0",
    description="Backend for the AI tech team company platform",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")
app.include_router(tasks_router, prefix="/api/v1")


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok", "service": settings.app_name}


if __name__ == '__main__':
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
