# AI Tech Team Company

## Phase 1 setup

### Requirements

- Docker and Docker Compose
- Node.js 20+
- Python 3.12+

### Local startup

```bash
cp .env.example .env
make dev-up
```

### Access points

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/docs

### Stop services

```bash
make dev-down
```

## Architecture notes

- Frontend: React dashboard shell with task board and command console
- Backend: FastAPI app exposing agent and task endpoints
- Memory: Chroma-ready with in-memory fallback for local testing
- Agents: Orchestrator, Developer, QA as production-ready MVP stubs
- Safety: Docker sandbox and approval workflow are scaffolded for later production work
