from __future__ import annotations

from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/agents", tags=["agents"])

AGENT_CATALOG = {
    "Orchestrator": {
        "id": "orchestrator",
        "name": "Orchestrator",
        "role": "CEO / Orchestrator",
        "model": "gpt-4o-mini",
        "status": "running",
        "current_task": "Reviewing project execution",
        "cost": 0.12,
        "health": 96,
        "tools": ["task_planner", "approval_gate", "memory_search"],
        "permissions": ["read", "write", "approve_risky_actions"],
    },
    "Developer": {
        "id": "developer",
        "name": "Developer",
        "role": "Full-stack developer",
        "model": "gpt-4o-mini",
        "status": "running",
        "current_task": "Building live dashboard features",
        "cost": 0.09,
        "health": 93,
        "tools": ["file_system", "docker_sandbox", "github"],
        "permissions": ["read", "write"],
    },
    "QA": {
        "id": "qa",
        "name": "QA",
        "role": "Quality Assurance",
        "model": "gpt-4o-mini",
        "status": "idle",
        "current_task": "Waiting for validation pass",
        "cost": 0.04,
        "health": 91,
        "tools": ["test_runner", "security_checks"],
        "permissions": ["read"],
    },
}


@router.get("")
def list_agents() -> list[dict]:
    return [
        {
            "id": agent["id"],
            "name": agent["name"],
            "role": agent["role"],
            "model": agent["model"],
            "status": agent["status"],
            "current_task": agent["current_task"],
            "cost": agent["cost"],
            "health": agent["health"],
            "tools": agent["tools"],
            "permissions": agent["permissions"],
        }
        for agent in AGENT_CATALOG.values()
    ]


@router.post("/{agent_name}/run")
def run_agent(agent_name: str, task: str) -> dict:
    agent = AGENT_CATALOG.get(agent_name)
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_name}' not found")

    return {
        "agent": agent["name"],
        "status": "done",
        "task": task,
        "result": {
            "status": "In plan",
            "plan": [
                "Break the request into milestones",
                "Assign the best-fit agent",
                "Request approval before risky actions",
                "Track output and metrics",
            ],
            "next_action": "Continue Phase 1 implementation and validation",
            "approval_needed": "no",
        },
    }
