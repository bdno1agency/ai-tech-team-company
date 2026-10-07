from __future__ import annotations

from typing import Any

from app.agents.base_agent import AgentConfig, BaseAgent


class OrchestratorAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            AgentConfig(
                name="Orchestrator",
                role="CEO / Orchestrator",
                model="gpt-4o-mini",
                temperature=0.2,
                status="idle",
                current_task="Monitoring active goals",
                tools=["task_planner", "approval_gate", "memory_search"],
                permissions=["read", "write", "approve_risky_actions"],
            )
        )

    def run(self, task: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
        return {
            "agent": self.config.name,
            "status": "done",
            "task": task,
            "result": {
                "status": "In plan",
                "plan": [
                    "Break the request into phases",
                    "Assign the work to the most relevant agent",
                    "Validate outputs before execution",
                    "Request approval before risky actions",
                ],
                "next_action": "Coordinate with the Developer and QA agents",
                "approval_needed": "no",
            },
            "context": context or {},
        }
