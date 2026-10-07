from __future__ import annotations

from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "ai-tech-team-company"
    app_env: str = "development"
    app_debug: bool = True
    backend_port: int = 8000
    frontend_port: int = 5173

    postgres_db: str = "ai_tech_team"
    postgres_user: str = "postgres"
    postgres_password: str = "postgres"
    postgres_host: str = "localhost"
    postgres_port: int = 5432

    redis_host: str = "localhost"
    redis_port: int = 6379

    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"

    openai_api_key: str | None = None
    anthropic_api_key: str | None = None

    chroma_host: str = "localhost"
    chroma_port: int = 8001

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
