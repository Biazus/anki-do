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

### Notas

- Seed/fixtures automatizados ficam para uma versão futura.
- Geração de perguntas e respostas por IA, com aprovação do usuário antes de criar o card, também está no roadmap.
- Refresh na tela de estudo reinicia a sessão (comportamento aceito no MVP).

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

### Notes

- Automated seed/fixtures are planned for a future version.
- AI-generated questions and answers, with user approval before creating a card, are also on the roadmap.
- Refreshing the study page restarts the session (accepted MVP behavior).
