from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException

from app.services.agent_config import list_agent_configs, get_agent_config

router = APIRouter(prefix="/agent-config", tags=["agent-config"])


@router.get("")
def list_configs() -> list[dict[str, Any]]:
    return list_agent_configs()


@router.get("/{agent_name}")
def load_config(agent_name: str) -> dict[str, Any]:
    try:
        return get_agent_config(agent_name)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
