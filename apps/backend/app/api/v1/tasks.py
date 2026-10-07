from __future__ import annotations

from fastapi import APIRouter

router = APIRouter(prefix="/tasks", tags=["tasks"])

TASKS = [
    {
        "id": "task-1",
        "title": "Project bootstrapping",
        "description": "Initialize the backend, frontend, and developer workflow",
        "status": "Done",
        "priority": "high",
        "assignee": "Orchestrator",
    },
    {
        "id": "task-2",
        "title": "Build dashboard shell",
        "description": "Create the core dashboard layout, command console, and task board",
        "status": "In Progress",
        "priority": "high",
        "assignee": "Developer",
    },
    {
        "id": "task-3",
        "title": "Validate the MVP flow",
        "description": "Run QA checks and edge-case validation on the dashboard workflow",
        "status": "To Do",
        "priority": "medium",
        "assignee": "QA",
    },
]


@router.get("")
def list_tasks() -> list[dict]:
    return TASKS


@router.post("")
def create_task(title: str, description: str, assignee: str = "Orchestrator") -> dict:
    task = {
        "id": f"task-{len(TASKS) + 1}",
        "title": title,
        "description": description,
        "status": "To Do",
        "priority": "medium",
        "assignee": assignee,
    }
    TASKS.append(task)
    return task
