from __future__ import annotations

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

    def run(self, task: str, context: dict | None = None) -> dict:
        return {
            "agent": self.config.name,
            "status": "done",
            "task": task,
            "result": {
                "status": "In plan",
                "plan": [
                    "Break the request into phases",
                    "Assign work to the best-fit agent",
                    "Request approval before risky actions",
                    "Track progress and dependencies",
                ],
                "next_action": "Assign the task to the Developer and QA agents",
                "approval_needed": "no",
            },
            "context": context or {},
        }


class DeveloperAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            AgentConfig(
                name="Developer",
                role="Frontend / Backend Developer",
                model="gpt-4o-mini",
                temperature=0.3,
                status="idle",
                current_task="Ready for implementation",
                tools=["file_system", "docker_sandbox", "github"],
                permissions=["read", "write"],
            )
        )

    def run(self, task: str, context: dict | None = None) -> dict:
        return {
            "agent": self.config.name,
            "status": "done",
            "task": task,
            "result": {
                "files": ["apps/backend/app/main.py", "apps/frontend/src/App.tsx"],
                "code": "Implementation scaffold generated",
                "tests": ["basic API health test"],
                "how_to_run": "Use docker compose up --build or run frontend and backend locally",
            },
            "context": context or {},
        }


class QAAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            AgentConfig(
                name="QA",
                role="Quality Assurance",
                model="gpt-4o-mini",
                temperature=0.1,
                status="idle",
                current_task="Ready for validation",
                tools=["test_runner", "security_checks"],
                permissions=["read"],
            )
        )

    def run(self, task: str, context: dict | None = None) -> dict:
        return {
            "agent": self.config.name,
            "status": "done",
            "task": task,
            "result": {
                "test_plan": ["health checks", "task validation", "dashboard render"],
                "bugs_found": [],
                "severity": "low",
                "suggested_fix": "Add completion checks and validation for all task states",
            },
            "context": context or {},
        }
