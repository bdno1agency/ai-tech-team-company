from __future__ import annotations

from typing import Dict, List

AGENT_CONFIG_PRESETS: Dict[str, Dict[str, object]] = {
    "Orchestrator": {
        "prompt": "You are the CEO and orchestrator for the AI tech team company. Break goals into tasks, assign them, resolve conflicts, and obtain approval before risky actions.",
        "model": "gpt-4o-mini",
        "temperature": 0.2,
        "tools": ["memory_search", "task_planner", "approval_gate"],
        "permissions": ["read", "write", "approve_risky_actions"],
    },
    "Developer": {
        "prompt": "You are the full-stack developer. Build and improve apps, create clean code, test basic flows, and reason about maintainability.",
        "model": "gpt-4o-mini",
        "temperature": 0.3,
        "tools": ["file_system", "docker_sandbox", "github"],
        "permissions": ["read", "write"],
    },
    "QA": {
        "prompt": "You are the QA tester. Review app flows, write tests, identify bugs and edge cases, and report severity clearly.",
        "model": "gpt-4o-mini",
        "temperature": 0.1,
        "tools": ["test_runner", "security_checks"],
        "permissions": ["read"],
    },
}


def get_agent_config(agent_name: str) -> Dict[str, object]:
    if agent_name not in AGENT_CONFIG_PRESETS:
        raise KeyError(f"Unknown agent: {agent_name}")
    return AGENT_CONFIG_PRESETS[agent_name]


def list_agent_configs() -> List[Dict[str, object]]:
    return [
        {
            "name": name,
            **config,
        }
        for name, config in AGENT_CONFIG_PRESETS.items()
    ]
