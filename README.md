# AI Tech Team Company

A multi-agent AI software company platform where every team member is an AI agent, controlled through a dashboard.

## Phase 1 MVP

This repository includes:
- FastAPI backend with agent endpoints
- React + Tailwind + shadcn-inspired dashboard
- Orchestrator, Developer, and QA agent skeletons
- Shared in-memory/Chroma memory layer
- Docker Compose setup for local development
- Command console and Kanban task board

## Stack
- Backend: FastAPI
- Frontend: React + Vite + Tailwind
- Memory: Chroma (with in-memory fallback)
- Database: PostgreSQL (config ready)
- Queue: Celery + Redis (config ready)
- Infra: Docker Compose

## Quick start

```bash
cp .env.example .env
make dev-up
```

Then open:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000/docs

## Folder structure

```text
ai-tech-team-company/
├── apps/
│   ├── backend/
│   ├── frontend/
│   └── sandbox/
├── docs/
├── docker-compose.yml
├── .env.example
├── Makefile
├── README.md
└── .gitignore
```

## Notes

This repo is built as a Phase 1 MVP scaffold. It is designed for rapid local development and future extension into the full multi-agent company platform described in the product brief.
