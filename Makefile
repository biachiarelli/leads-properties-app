.PHONY: help db-up db-down db-logs install dev backend frontend clean

help: ## Mostra esta mensagem de ajuda
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

db-up: ## Inicia o banco de dados (PostgreSQL + PostGIS)
	docker-compose up -d

db-down: ## Para o banco de dados
	docker-compose down

db-logs: ## Mostra os logs do banco de dados
	docker-compose logs -f

db-clean: ## Para e remove o banco de dados (APAGA OS DADOS!)
	docker-compose down -v

install: ## Instala dependências do backend e frontend
	cd backend && npm install
	cd frontend && npm install --legacy-peer-deps

backend: ## Inicia o backend em modo desenvolvimento
	cd backend && npm run start:dev

frontend: ## Inicia o frontend em modo desenvolvimento
	cd frontend && npm start

dev: ## Inicia tudo (banco + backend + frontend) - use 3 terminais
	@echo "Execute em terminais separados:"
	@echo "  Terminal 1: make db-up"
	@echo "  Terminal 2: make backend"
	@echo "  Terminal 3: make frontend"

build-backend: ## Build do backend
	cd backend && npm run build

build-frontend: ## Build do frontend
	cd frontend && npm run build

clean: ## Limpa node_modules e builds
	rm -rf backend/node_modules backend/dist
	rm -rf frontend/node_modules frontend/dist

status: ## Mostra o status do banco de dados
	docker-compose ps

full-docker: ## Inicia tudo em Docker (frontend + backend + database)
	docker-compose -f docker-compose.full.yml up -d

full-docker-down: ## Para todos os containers Docker
	docker-compose -f docker-compose.full.yml down

full-docker-logs: ## Logs de todos os containers Docker
	docker-compose -f docker-compose.full.yml logs -f

