from __future__ import annotations

from fastapi import APIRouter

from app.services.task_queue import TaskQueue

router = APIRouter(prefix="/tasks", tags=["tasks"])

task_queue = TaskQueue()


@router.get("")
def list_tasks() -> list[dict]:
    return [
        {
            "id": "task-1",
            "title": "Project bootstrapping",
            "description": "Initialize backend, frontend, and shared services",
            "status": "Done",
            "priority": "high",
            "assignee": "Orchestrator",
        },
        {
            "id": "task-2",
            "title": "Build dashboard shell",
            "description": "Create a working dashboard with overview cards and command console",
            "status": "In Progress",
            "priority": "high",
            "assignee": "Developer",
        },
        {
            "id": "task-3",
            "title": "Validate the MVP flow",
            "description": "Run QA checks and edge-case validation",
            "status": "To Do",
            "priority": "medium",
            "assignee": "QA",
        },
    ]


@router.post("")
def create_task(title: str, description: str, assignee: str = "Orchestrator") -> dict:
    task = {
        "id": f"task-{len(task_queue.list()) + 1}",
        "title": title,
        "description": description,
        "status": "To Do",
        "priority": "medium",
        "assignee": assignee,
    }
    task_queue.add(task)
    return task
