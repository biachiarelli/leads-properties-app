# Backend – Leads App API

API REST desenvolvida com NestJS para gerenciamento de leads e propriedades rurais, incluindo dashboard de métricas.

## 🚀 Tecnologias
- NestJS
- TypeORM
- PostgreSQL com PostGIS
- Class Validator
- Docker (Banco de Dados)

## ⚙️ Configuração

### Variáveis de ambiente
Crie um arquivo .env baseado no .env.example:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=leads_db
```

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose (para o banco de dados)
- npm ou yarn

### 1. Iniciar o banco de dados (PostgreSQL + PostGIS)
Na raiz do projeto:

```bash
docker-compose up -d
```

### 2. Backend (NestJS)

```bash
cd backend
npm install
npm start
```

O backend estará disponível em: **http://localhost:3000**

### 📝 Comandos Úteis

**Banco de dados:**
```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Parar e limpar dados
docker-compose down -v
```


## 🧪 Testes

```bash
cd backend
npm run test
```


