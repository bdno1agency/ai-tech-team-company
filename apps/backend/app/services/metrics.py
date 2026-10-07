from __future__ import annotations

from typing import Any


class MetricsService:
    @staticmethod
    def get_dashboard_metrics() -> dict[str, Any]:
        return {
            "tokens": 24000,
            "cost": 3.42,
            "success_rate": 92,
            "time_per_task": "14 min",
            "tasks_completed": 7,
            "agents_online": 3,
        }
