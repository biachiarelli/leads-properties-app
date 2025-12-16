# Leads App - Sistema de Gestão de Leads e Propriedades Rurais

Sistema completo de CRUD para gerenciamento de leads e propriedades rurais com dashboard de métricas.

## 🚀 Tecnologias

### Backend
- NestJS
- TypeORM
- PostgreSQL com PostGIS
- Class Validator

### Frontend
- Angular 17+
- PrimeNG
- RxJS

## 📋 Funcionalidades

### Leads
- ✅ Cadastro completo de leads
- ✅ Listagem com filtros avançados
- ✅ Edição de informações
- ✅ Remoção de leads
- ✅ Campos: nome, CPF, status, comentários, município

### Propriedades Rurais
- ✅ Cadastro de propriedades vinculadas a leads
- ✅ Listagem com filtros
- ✅ Edição e remoção
- ✅ Campos: cultura, área (hectares), geometria (GeoJSON)

### Dashboard
- 📊 Total de leads
- 📊 Leads por status
- 📊 Leads por município
- ⭐ Indicador visual de leads prioritários (área > 100 hectares)

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose (para o banco de dados)
- npm ou yarn

## 🚀 Início Rápido


### 1. Iniciar o banco de dados (PostgreSQL + PostGIS)
```bash
docker-compose up -d
```

### 2. Backend (NestJS) - em outro terminal
```bash
cd backend
npm install
npm run start:dev
```

O backend estará disponível em: **http://localhost:3000**

### 3. Frontend (Angular) - em outro terminal
```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

O frontend estará disponível em: **http://localhost:4200**

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

### Backend
```bash
cd backend
npm run test
```

### Frontend
```bash
cd frontend
npm run test
```

