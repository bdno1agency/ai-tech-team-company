from __future__ import annotations

from fastapi import APIRouter

from app.agents.orchestrator import OrchestratorAgent
from app.agents.developer import DeveloperAgent
from app.agents.qa import QAAgent

router = APIRouter(prefix="/agents", tags=["agents"])

agent_registry = {
    "Orchestrator": OrchestratorAgent(),
    "Developer": DeveloperAgent(),
    "QA": QAAgent(),
}


@router.get("")
def list_agents() -> list[dict]:
    return [
        {
            "id": agent.config.name.lower(),
            "name": agent.config.name,
            "role": agent.config.role,
            "model": agent.config.model,
            "status": agent.config.status,
            "current_task": agent.config.current_task,
            "cost": agent.config.cost,
            "health": agent.config.health,
            "tools": agent.config.tools,
            "permissions": agent.config.permissions,
        }
        for agent in agent_registry.values()
    ]


@router.post("/{agent_name}/run")
def run_agent(agent_name: str, task: str) -> dict:
    agent = agent_registry.get(agent_name)
    if not agent:
        return {"error": f"Agent '{agent_name}' not found"}
    return agent.run(task)
