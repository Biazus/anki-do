# anki-do

Flashcards estilo Anki · Anki-style flashcards.

- [Português](#portugues)
- [English](#english)

---

<a id="portugues"></a>

## Português

### Início rápido

```bash
cp .env.example .env
docker compose up --build -d
docker compose exec backend alembic upgrade head
cd frontend && npm install && npm run dev
```

Abra **http://localhost:5174** (porta em `FRONTEND_PORT`).

| Serviço  | URL |
| -------- | --- |
| Frontend | http://localhost:5174 |
| Backend  | http://localhost:8001 |
| Health   | http://localhost:8001/health |

### Smoke test

1. **Tópicos** → criar um tópico (ex.: `Python`)
2. **Novo Card** → cadastrar pergunta e resposta
3. **Home** → **Estudar** no tópico
4. Virar o card → **Mostrar detalhes** (se houver) → **Próxima**
5. **Sair** ou esgotar os cards
6. **Random** na Home → estudar cards de todos os tópicos

### Variáveis de ambiente

| Variável | Descrição | Padrão |
| -------- | --------- | ------ |
| `POSTGRES_*` | Credenciais e porta do Postgres | ver `.env.example` |
| `BACKEND_PORT` | Porta do API no host | `8001` |
| `DATABASE_URL` | Conexão local (fora do Docker) | — |
| `CORS_ORIGINS` | Origens permitidas | `http://localhost:5174` |
| `FRONTEND_PORT` | Porta do Vite | `5174` |
| `VITE_API_URL` | URL da API (vazio = proxy no dev) | — |

### Stack

- **Backend:** FastAPI, SQLAlchemy, Alembic, PostgreSQL
- **Frontend:** React, Vite, TypeScript, React Router
- **Infra:** Docker Compose (dev local)

### MVP (limitações atuais)

- Sem autenticação
- Sem editar/excluir tópicos e cards
- Sessão de estudo não persiste (refresh reinicia)
- Otimizado para menos de 200 cards por sessão

### Roadmap (escopo futuro)

- Autenticação
- Editar/excluir tópicos e cards
- Spaced repetition (SM-2)
- Rodadas com cards pulados que voltam
- Persistência de sessão (ex.: `localStorage`)
- Seed/fixtures automatizados
- Geração de perguntas e respostas por IA, com aprovação do usuário antes de criar o card
- Paginação de cards
- Testes automatizados (E2E/unit)
- Deploy em produção (CI/CD, nginx)
- Busca/filtro de tópicos

---

<a id="english"></a>

## English

### Quick start

```bash
cp .env.example .env
docker compose up --build -d
docker compose exec backend alembic upgrade head
cd frontend && npm install && npm run dev
```

Open **http://localhost:5174** (port from `FRONTEND_PORT`).

| Service  | URL |
| -------- | --- |
| Frontend | http://localhost:5174 |
| Backend  | http://localhost:8001 |
| Health   | http://localhost:8001/health |

### Smoke test

1. **Topics** → create a topic (e.g. `Python`)
2. **New Card** → add question and answer
3. **Home** → **Study** on the topic
4. Flip the card → **Show details** (if any) → **Next**
5. **Exit** or finish all cards
6. **Random** on Home → study cards from all topics

### Environment variables

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `POSTGRES_*` | Postgres credentials and port | see `.env.example` |
| `BACKEND_PORT` | API port on host | `8001` |
| `DATABASE_URL` | Local connection (outside Docker) | — |
| `CORS_ORIGINS` | Allowed origins | `http://localhost:5174` |
| `FRONTEND_PORT` | Vite dev server port | `5174` |
| `VITE_API_URL` | API URL (empty = dev proxy) | — |

### Stack

- **Backend:** FastAPI, SQLAlchemy, Alembic, PostgreSQL
- **Frontend:** React, Vite, TypeScript, React Router
- **Infra:** Docker Compose (local dev)

### MVP (current limitations)

- No authentication
- No edit/delete for topics and cards
- Study session does not persist (refresh restarts it)
- Optimized for under 200 cards per session

### Roadmap (future scope)

- Authentication
- Edit/delete topics and cards
- Spaced repetition (SM-2)
- Rounds with skipped cards returning later
- Session persistence (e.g. `localStorage`)
- Automated seed/fixtures
- AI-generated questions and answers, with user approval before creating a card
- Card pagination
- Automated tests (E2E/unit)
- Production deploy (CI/CD, nginx)
- Topic search/filter
