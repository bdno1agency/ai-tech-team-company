from __future__ import annotations

from typing import Any


class InMemoryMemory:
    def __init__(self):
        self.documents: list[dict[str, Any]] = []

    def add(self, payload: dict[str, Any]) -> None:
        self.documents.append(payload)

    def search(self, query: str, limit: int = 5) -> list[dict[str, Any]]:
        if not query:
            return self.documents[:limit]
        query_lower = query.lower()
        matches = []
        for item in self.documents:
            text = str(item.get("content", "")).lower()
            if query_lower in text:
                matches.append(item)
        return matches[:limit]


MemoryStore = InMemoryMemory()
