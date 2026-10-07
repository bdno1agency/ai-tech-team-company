from __future__ import annotations

from typing import Any


class ApprovalQueue:
    def __init__(self):
        self.items: list[dict[str, Any]] = [
            {
                "id": "approval-1",
                "action": "Deploy to production",
                "reason": "Requires owner approval",
                "status": "pending",
            },
            {
                "id": "approval-2",
                "action": "Delete temp workspace",
                "reason": "Destructive action",
                "status": "pending",
            },
        ]

    def list(self) -> list[dict[str, Any]]:
        return self.items

    def decide(self, approval_id: str, decision: str) -> dict[str, Any]:
        for item in self.items:
            if item["id"] == approval_id:
                item["status"] = "approved" if decision == "approve" else "rejected"
                return item
        raise KeyError(f"Approval item '{approval_id}' not found")


approval_queue = ApprovalQueue()
