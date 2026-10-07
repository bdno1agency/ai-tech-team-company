from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Literal


@dataclass
class AgentConfig:
    name: str
    role: str
    model: str = "gpt-4o-mini"
    temperature: float = 0.2
    status: Literal["idle", "running", "blocked", "done"] = "idle"
    current_task: str = "Waiting for assignment"
    health: int = 100
    cost: float = 0.0
    tools: list[str] = field(default_factory=list)
    permissions: list[str] = field(default_factory=list)


class BaseAgent:
    def __init__(self, config: AgentConfig):
        self.config = config

    def run(self, task: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
        self.config.status = "running"
        self.config.current_task = task
        result = {
            "agent": self.config.name,
            "status": "running",
            "task": task,
            "result": "Agent is ready; implementation pending for production logic.",
            "context": context or {},
        }
        self.config.status = "done"
        self.config.health = 95
        return result
