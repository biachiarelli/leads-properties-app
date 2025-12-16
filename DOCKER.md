# 🐳 Guia Docker - Leads App

Este documento explica a arquitetura Docker da aplicação e como usá-la.

## **database** (PostgreSQL + PostGIS)
- **Imagem**: `postgis/postgis:15-3.3-alpine`
- **Porta**: 5432
- **Volume**: `postgres_data` (persistência dos dados)
- **Healthcheck**: Verifica se o PostgreSQL está pronto antes de iniciar o backend

## 🚀 Comandos Principais

### Usando Docker Compose

```bash
# Iniciar toda a aplicação
docker-compose up -d

# Parar todos os serviços
docker-compose down

# Parar e remover volumes 
docker-compose down -v

# Reconstruir após mudanças no código
docker-compose up -d --build

# Ver status dos containers
docker-compose ps
```
