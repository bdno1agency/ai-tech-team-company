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
                "current_task": "Reviewing project execution",
                "model": "gpt-4o-mini",
                "cost": 0.12,
                "health": 96,
            },
            {
                "id": "developer",
                "name": "Developer",
                "status": "running",
                "current_task": "Building dashboard shell",
                "model": "gpt-4o-mini",
                "cost": 0.09,
                "health": 93,
            },
            {
                "id": "qa",
                "name": "QA",
                "status": "idle",
                "current_task": "Waiting for review",
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
            {"id": 1, "timestamp": "09:41", "agent": "Orchestrator", "message": "Assigned developer to build the dashboard shell."},
            {"id": 2, "timestamp": "09:47", "agent": "Developer", "message": "Created the initial backend and frontend skeleton."},
            {"id": 3, "timestamp": "09:53", "agent": "QA", "message": "Prepared validation checks for the MVP flow."},
        ],
    }


@router.post("/command")
def command(command: str) -> dict:
    return {
        "accepted": True,
        "result": f"Command received: '{command}'. The Orchestrator is evaluating the next best action.",
        "agent": "Orchestrator",
    }
