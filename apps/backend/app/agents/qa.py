from __future__ import annotations

from typing import Any

from app.agents.base_agent import AgentConfig, BaseAgent


class DeveloperAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            AgentConfig(
                name="Developer",
                role="Full-stack developer",
                model="gpt-4o-mini",
                temperature=0.3,
                status="idle",
                current_task="Ready for implementation",
                tools=["file_system", "docker_sandbox", "github"],
                permissions=["read", "write"],
            )
        )

    def run(self, task: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
        return {
            "agent": self.config.name,
            "status": "done",
            "task": task,
            "result": {
                "files": ["apps/backend/app/main.py", "apps/frontend/src/App.tsx"],
                "code": "Core MVP scaffold generated for the AI tech team company dashboard",
                "tests": ["basic health check test"],
                "how_to_run": "docker compose up --build or run frontend and backend separately",
            },
            "context": context or {},
        }
