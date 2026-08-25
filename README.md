# anki-do

Flashcards estilo Anki. Monorepo com backend FastAPI, frontend React/Vite e PostgreSQL.

## Setup local

1. Copie as variáveis de ambiente:

   ```bash
   cp .env.example .env
   ```

2. Suba o banco e o backend com Docker Compose:

   ```bash
   docker compose up --build
   ```

   Postgres expõe a porta **5433** no host; o backend expõe **8001**. Ajuste via `POSTGRES_PORT` e `BACKEND_PORT` no `.env`.

3. Em outro terminal, rode o frontend localmente:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   O Vite lê variáveis do `.env` na raiz do monorepo (`envDir: '..'`). A porta do dev server é `FRONTEND_PORT` (padrão 5173).

## URLs

| Serviço  | URL                          | Como sobe        |
| -------- | ---------------------------- | ---------------- |
| Frontend | http://localhost:5174        | `npm run dev`    |
| Backend  | http://localhost:8001        | Docker Compose   |
| Health   | http://localhost:8001/health | Docker Compose   |

## Health check

```bash
curl http://localhost:8001/health
```

Resposta esperada:

```json
{"status": "ok", "db": "connected"}
```
