from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.services.approval_queue import approval_queue

router = APIRouter(prefix="/approvals", tags=["approvals"])


@router.get("")
def list_approvals() -> list[dict]:
    return approval_queue.list()


@router.post("/{approval_id}/{decision}")
def handle_approval(approval_id: str, decision: str) -> dict:
    if decision not in {"approve", "reject"}:
        raise HTTPException(status_code=400, detail="Decision must be either 'approve' or 'reject'")

    try:
        item = approval_queue.decide(approval_id, decision)
        return {"status": "ok", "decision": decision, "approval": item}
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
