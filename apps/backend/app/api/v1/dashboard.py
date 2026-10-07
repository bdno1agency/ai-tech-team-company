from __future__ import annotations

from fastapi import APIRouter

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/overview")
def overview() -> dict:
    return {
        "agents": [
            {
                "id": "orchestrator",
                "name": "Orchestrator",
                "status": "running",
                "current_task": "Reviewing team execution",
                "model": "gpt-4o-mini",
                "cost": 0.12,
                "health": 96,
            },
            {
                "id": "developer",
                "name": "Developer",
                "status": "running",
                "current_task": "Building live dashboard features",
                "model": "gpt-4o-mini",
                "cost": 0.09,
                "health": 93,
            },
            {
                "id": "qa",
                "name": "QA",
                "status": "idle",
                "current_task": "Waiting for validation pass",
                "model": "gpt-4o-mini",
                "cost": 0.04,
                "health": 91,
            },
        ],
        "metrics": {
            "tokens": 24000,
            "cost": 3.42,
            "success_rate": 92,
            "time_per_task": "14 min",
        },
        "approval_queue": [
            {"id": "approval-1", "action": "Deploy to production", "reason": "Needs owner sign-off"},
            {"id": "approval-2", "action": "Delete temp workspace", "reason": "Destructive action"},
        ],
        "logs": [
            {"id": 1, "timestamp": "09:41", "agent": "Orchestrator", "message": "Assigned Developer to build the live dashboard shell."},
            {"id": 2, "timestamp": "09:47", "agent": "Developer", "message": "Built the Phase 1 dashboard layout and command flow."},
            {"id": 3, "timestamp": "09:53", "agent": "QA", "message": "Prepared validation checks for the MVP flow."},
        ],
        "memory": [
            {"title": "Project bootstrap complete", "snippet": "The backend and frontend were scaffolded successfully and are ready for active tasking."},
            {"title": "Dashboard shell ready", "snippet": "The UI has a working task board, command console, and orchestrator panels."},
        ],
    }


@router.post("/command")
def command(command: str) -> dict:
    return {
        "accepted": True,
        "result": f"Command received: '{command}'. The Orchestrator is evaluating the best next action for the team.",
        "agent": "Orchestrator",
    }
