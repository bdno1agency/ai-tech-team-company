from __future__ import annotations

from pydantic import BaseModel, Field
from typing import Literal


class TaskItem(BaseModel):
    id: str
    title: str
    description: str
    status: Literal["To Do", "In Progress", "Blocked", "Done"] = "To Do"
    priority: Literal["low", "medium", "high"] = "medium"
    assignee: str = "Orchestrator"


class TaskCreateRequest(BaseModel):
    title: str
    description: str
    assignee: str = "Orchestrator"
    status: Literal["To Do", "In Progress", "Blocked", "Done"] = "To Do"
