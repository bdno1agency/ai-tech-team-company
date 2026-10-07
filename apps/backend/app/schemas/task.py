from __future__ import annotations

from pydantic import BaseModel, Field


class AgentSchema(BaseModel):
    id: str
    name: str
    role: str
    model: str = "gpt-4o-mini"
    status: str = "idle"
    current_task: str = "Waiting for assignment"
    cost: float = 0.0
    health: int = 100
    tools: list[str] = Field(default_factory=list)
    permissions: list[str] = Field(default_factory=list)


class CommandRequest(BaseModel):
    command: str


class CommandResponse(BaseModel):
    accepted: bool
    result: str
    agent: str
