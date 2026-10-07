# AI Tech Team Company

A multi-agent AI software company platform where every team member is an AI agent, controlled through a dashboard.

## Phase 1 status

The live Phase 1 dashboard is in progress on the `phase-1/live-dashboard` branch.

### Included
- FastAPI backend with agent endpoints
- React + Tailwind dashboard shell
- Orchestrator, Developer, and QA agent stubs
- Shared memory abstraction
- Docker Compose local environment
- Live command console and task board

## Run locally

```bash
cp .env.example .env
make dev-up
```

Then open:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000/docs

## Project structure

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

This repo is a working MVP scaffold for the full AI Tech Team Company system described in the product brief. The architecture is designed to extend toward full orchestration, approval gates, multi-agent collaboration, and execution sandboxing.
