from __future__ import annotations

from typing import Any


class TaskQueue:
    def __init__(self):
        self.items: list[dict[str, Any]] = []

    def add(self, item: dict[str, Any]) -> dict[str, Any]:
        self.items.append(item)
        return item

    def list(self) -> list[dict[str, Any]]:
        return self.items
