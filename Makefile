# Makefile

.PHONY: install backend frontend dev-up dev-down

install:
	cd apps/frontend && npm install
	cd apps/backend && python -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt

backend:
	cd apps/backend && . .venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

frontend:
	cd apps/frontend && npm run dev -- --host 0.0.0.0

dev-up:
	docker compose up --build

dev-down:
	docker compose down -v
