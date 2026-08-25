# Plano de Desenvolvimento — anki-do

Flashcards estilo Anki. Monorepo com backend FastAPI, frontend React/Vite e PostgreSQL.

**Abordagem:** vertical slices — cada etapa entrega algo testável ponta a ponta.

---

## Stack


| Camada   | Tecnologia                                      |
| -------- | ----------------------------------------------- |
| Backend  | FastAPI + SQLAlchemy + Alembic + PostgreSQL     |
| Frontend | React + Vite + TypeScript + React Router        |
| Infra    | Docker Compose (dev local, preparado p/ deploy) |
| Auth     | Nenhum no MVP                                   |


---



## Requisitos MVP



### Home (`/`)

- Listar tópicos com contagem de cards
- Botão **Estudar** por tópico
- Botão **Random** (todos os cards de todos os tópicos)
- Bloquear Estudar se `card_count === 0`
- Bloquear Random se total de cards === 0
- Empty states claros
- Links para `/topics` e `/cards/new`



### Estudo (`/study/:topicId` e `/study/random`)

- Uma carta por vez, estilo Anki
- Ordem aleatória sem repetição na sessão (Fisher-Yates, uma vez)
- **Próxima** sempre habilitado — conclui o card independente de ter virado
- **Virar** opcional — flip 3D CSS (fallback fade se Safari/iOS falhar)
- **Descrição extendida:** texto puro; só após virar + expandir painel lateral; nunca junto com a pergunta
- **Sair** — encerra sessão e volta à home
- Sessão esgota quando todos os cards foram exibidos → volta à home
- Random = todos os cards de todos os tópicos



### Tópicos (`/topics`)

- Tela separada: listar + criar tópicos
- Sem edição/exclusão no MVP
- Nome único (case-insensitive), max 60 chars



### Cadastro de cards (`/cards/new`)

- Select de tópico, pergunta (280), resposta (800), descrição extendida opcional (3000)
- Contador de chars em tempo real
- Validação frontend + backend
- Debounce/disable no submit para evitar duplicatas

---



## Máquina de estados da sessão

Estados: `idle` | `loading` | `pending` | `completed` | `error`

```
1. Carrega todos os cards (GET /cards?topic_id=X ou ?random=true)
2. Shuffle Fisher-Yates → queue[]
3. Exibe queue[currentIndex] — só a pergunta na frente
4. Ações: Virar (UI) | Mostrar detalhes (só se virou + tem extendida) | Próxima | Sair
5. Próxima → card concluído, currentIndex++
6. currentIndex >= queue.length → sessão esgotada → redirect /
7. Sair → redirect /
```

- Sem rodadas, sem `skippedIds`, sem spaced repetition
- Refresh da página reinicia a sessão (dívida aceita no MVP)
- MVP assume < 200 cards por sessão



### Fim de sessão

- **Manual:** botão Sair
- **Automático:** esgotamento de perguntas (todos os cards exibidos)

Em ambos os casos → volta à seleção de tópicos.

---



## Modelo de dados

```
Topic (1) ──► (N) Card
```



### Topic


| Campo      | Tipo        | Observações               |
| ---------- | ----------- | ------------------------- |
| id         | int PK      | autoincrement             |
| name       | varchar(60) | unique (case-insensitive) |
| created_at | timestamptz | default UTC               |


Índice: `CREATE UNIQUE INDEX ix_topics_name_lower ON topics (LOWER(name));`

### Card


| Campo                | Tipo          | Observações              |
| -------------------- | ------------- | ------------------------ |
| id                   | int PK        | autoincrement            |
| topic_id             | int FK        | ON DELETE RESTRICT       |
| question             | varchar(280)  | frente da carta          |
| answer               | varchar(800)  | verso da carta           |
| extended_description | varchar(3000) | nullable; painel lateral |
| created_at           | timestamptz   | default UTC              |


Índice em `cards.topic_id`.

---



## Limites de caracteres


| Campo               | Limite | UI no cadastro      |
| ------------------- | ------ | ------------------- |
| Nome do tópico      | 60     | contador + bloqueio |
| Pergunta            | 280    | contador + bloqueio |
| Resposta            | 800    | contador + bloqueio |
| Descrição extendida | 3000   | contador + bloqueio |


Aviso visual aos 90% do limite.

---



## API MVP


| Método | Endpoint | Descrição                                                                    |
| ------ | -------- | ---------------------------------------------------------------------------- |
| GET    | /health  | `{ status, db }`                                                             |
| GET    | /topics  | Listar tópicos (com `card_count`)                                            |
| POST   | /topics  | Criar tópico; 409 se duplicata                                               |
| GET    | /cards   | `?topic_id=` ou `?random=true` (mutuamente exclusivos; 422 se ambos/ nenhum) |
| POST   | /cards   | Criar card                                                                   |




### Schemas Pydantic

```python
# TopicCreate
name: str = Field(..., min_length=1, max_length=60)

# TopicRead
id: int
name: str
card_count: int | None
created_at: datetime

# CardCreate
topic_id: int = Field(..., gt=0)
question: str = Field(..., min_length=1, max_length=280)
answer: str = Field(..., min_length=1, max_length=800)
extended_description: str | None = Field(None, max_length=3000)

# CardRead
id: int
topic_id: int
question: str
answer: str
extended_description: str | None
created_at: datetime
```

Backend **stateless** — toda lógica de sessão no frontend.

---



## Estrutura de pastas

```
anki-do/
├── PLAN.md
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── pyproject.toml
│   ├── alembic.ini
│   ├── alembic/
│   │   └── versions/
│   └── app/
│       ├── main.py
│       ├── config.py
│       ├── database.py
│       ├── models/
│       │   ├── topic.py
│       │   └── card.py
│       ├── schemas/
│       │   ├── topic.py
│       │   └── card.py
│       ├── api/
│       │   ├── deps.py
│       │   └── routes/
│       │       ├── health.py
│       │       ├── topics.py
│       │       └── cards.py
│       └── services/
│           └── topic_service.py
│
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── api/
        │   ├── client.ts
        │   ├── topics.ts
        │   └── cards.ts
        ├── types/
        │   ├── topic.ts
        │   ├── card.ts
        │   └── study.ts
        ├── hooks/
        │   └── useStudySession.ts
        ├── utils/
        │   ├── shuffle.ts
        │   └── flipSupport.ts
        ├── styles/
        │   ├── global.css
        │   ├── variables.css
        │   └── reduced-motion.css
        ├── components/
        │   ├── layout/
        │   │   ├── AppLayout.tsx
        │   │   └── PageHeader.tsx
        │   ├── ui/
        │   │   ├── Button.tsx
        │   │   ├── CharCounter.tsx
        │   │   ├── Input.tsx
        │   │   ├── Select.tsx
        │   │   ├── EmptyState.tsx
        │   │   └── LoadingSpinner.tsx
        │   ├── topics/
        │   │   ├── TopicList.tsx
        │   │   └── TopicForm.tsx
        │   ├── cards/
        │   │   └── CardForm.tsx
        │   └── study/
        │       ├── StudyCard.tsx
        │       ├── StudyActions.tsx
        │       ├── ExtendedPanel.tsx
        │       └── StudyLayout.tsx
        └── pages/
            ├── HomePage.tsx
            ├── TopicsPage.tsx
            ├── CardNewPage.tsx
            └── StudyPage.tsx
```

---



## Hook `useStudySession`



### Interface TypeScript

```typescript
export type SessionStatus = 'idle' | 'loading' | 'pending' | 'completed' | 'error';

export type StudyMode =
  | { type: 'topic'; topicId: number }
  | { type: 'random' };

export interface StudyCard {
  id: number;
  topic_id: number;
  question: string;
  answer: string;
  extended_description: string | null;
}

export interface UseStudySessionOptions {
  mode: StudyMode;
  onSessionEnd: () => void;
}

export interface UseStudySessionReturn {
  status: SessionStatus;
  error: string | null;
  currentCard: StudyCard | null;
  currentIndex: number;
  totalCards: number;
  progressLabel: string;       // ex: "3 / 10"
  isFlipped: boolean;
  isExtendedOpen: boolean;
  hasExtended: boolean;
  canShowExtended: boolean;    // isFlipped && hasExtended
  flip: () => void;
  toggleExtended: () => void;
  next: () => void;
  exit: () => void;
}
```



### Pseudocódigo

```
on mount:
  status = 'loading'
  cards = fetch by mode (topic_id or random=true)
  if cards.length == 0 → onSessionEnd()
  queue = fisherYatesShuffle(cards)
  status = 'pending'

flip():
  isFlipped = true

toggleExtended():
  if isFlipped && currentCard.extended_description:
    isExtendedOpen = !isExtendedOpen

next():
  currentIndex++
  isFlipped = false
  isExtendedOpen = false
  if currentIndex >= queue.length → onSessionEnd()

exit():
  onSessionEnd()
```

---



## Componentes React


| Componente    | Responsabilidade                                      |
| ------------- | ----------------------------------------------------- |
| AppLayout     | Shell com nav: Home, Tópicos, Novo Card               |
| PageHeader    | Título consistente por página                         |
| TopicList     | Lista read-only de tópicos                            |
| TopicForm     | Criar tópico; validação 60 chars                      |
| CardForm      | Form completo com contadores e select de tópico       |
| StudyLayout   | Header + área do card + ações; progresso e botão Sair |
| StudyCard     | Flip 3D (fallback fade); pergunta OU resposta         |
| StudyActions  | Virar, Próxima (sempre ativo), Sair, Mostrar detalhes |
| ExtendedPanel | Painel lateral; texto puro; só se virou               |
| EmptyState    | Zero tópicos / zero cards                             |
| CharCounter   | `current/max` com alerta perto do limite              |




### Layout da sessão de estudo

```
┌─────────────────────────────────────────────────┐
│  Tópico: Python          [Sair]    3 / 10       │
├──────────────────────────┬──────────────────────┤
│                          │  (painel lateral     │
│      ┌──────────┐        │   oculto por padrão) │
│      │ PERGUNTA │ ←flip→ │                      │
│      │          │        │  [Mostrar detalhes]  │
│      └──────────┘        │  (só se virou)       │
│                          │                      │
│  [Virar]  [ Próxima ]    │                      │
└──────────────────────────┴──────────────────────┘
```



### Flip 3D CSS

```css
.cardContainer { perspective: 1000px; }
.cardInner { transform-style: preserve-3d; transition: transform 0.5s ease; }
.cardInner.flipped { transform: rotateY(180deg); }
.cardFace { backface-visibility: hidden; }
.cardBack { transform: rotateY(180deg); }
```

- Fallback: fade/swap se Safari/iOS falhar
- `prefers-reduced-motion: reduce` → transição instantânea

---



## Docker Compose

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-anki}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-anki}
      POSTGRES_DB: ${POSTGRES_DB:-anki_do}
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-anki} -d ${POSTGRES_DB:-anki_do}"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    environment:
      DATABASE_URL: postgresql+psycopg://${POSTGRES_USER:-anki}:${POSTGRES_PASSWORD:-anki}@db:5432/${POSTGRES_DB:-anki_do}
      CORS_ORIGINS: ${CORS_ORIGINS:-http://localhost:5173}
      APP_ENV: ${APP_ENV:-development}
    ports:
      - "${BACKEND_PORT:-8000}:8000"
    volumes:
      - ./backend:/app
    depends_on:
      db:
        condition: service_healthy

  frontend:
    build: ./frontend
    command: npm run dev -- --host 0.0.0.0
    environment:
      VITE_API_URL: ${VITE_API_URL:-http://localhost:8000}
    ports:
      - "${FRONTEND_PORT:-5173}:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend

volumes:
  pgdata:
```

---



## Variáveis de ambiente (`.env.example`)

```env
# PostgreSQL
POSTGRES_USER=anki
POSTGRES_PASSWORD=anki
POSTGRES_DB=anki_do
POSTGRES_PORT=5432

# Backend
BACKEND_PORT=8000
DATABASE_URL=postgresql+psycopg://anki:anki@localhost:5432/anki_do
CORS_ORIGINS=http://localhost:5173
APP_ENV=development

# Frontend
FRONTEND_PORT=5173
VITE_API_URL=http://localhost:8000
```

---



## Etapas de implementação

                    

### Etapa 1 — Fundação do monorepo e Docker

**Objetivo:** Subir stack local com um comando.

**Escopo:** `docker-compose.yml`, `.env.example`, `.gitignore`, `README.md`, Dockerfiles mínimos.

**Critérios de pronto:**

- [ ] `docker compose up` sobe postgres, backend (health 200), frontend (Vite)
- [ ] `.env.example` documentado
- [ ] README com `cp .env.example .env`

**Depende de:** —

---



### Etapa 2 — Backend: config, DB e models

**Objetivo:** Persistência PostgreSQL com SQLAlchemy.

**Escopo:** `config.py`, `database.py`, models `Topic` e `Card`, Alembic + migration inicial.

**Critérios de pronto:**

- [ ] Migration aplica sem erro
- [ ] FK `cards.topic_id → topics.id`
- [ ] `topics.name` unique + índice `LOWER(name)`
- [ ] `created_at` com default UTC

**Depende de:** Etapa 1

---



### Etapa 3 — Backend: schemas Pydantic

**Objetivo:** Contratos de API com limites de chars.

**Escopo:** Schemas request/response para topics e cards.

**Critérios de pronto:**

- [ ] Limites: 60/280/800/3000
- [ ] `extended_description` opcional/nullable
- [ ] `TopicRead` inclui `card_count`

**Depende de:** Etapa 2

---



### Etapa 4 — Backend: rotas API

**Objetivo:** API MVP completa e stateless.

**Escopo:** `GET /health`, `GET/POST /topics`, `GET/POST /cards`.

**Critérios de pronto:**

- [ ] `/health` retorna `{ status, db }`
- [ ] `POST /topics` rejeita duplicata case-insensitive (409)
- [ ] `GET /cards` valida `topic_id` XOR `random` (422)
- [ ] `GET /topics` com `card_count`
- [ ] CORS via env

**Depende de:** Etapas 2, 3

---



### Etapa 5 — Frontend: scaffold e API client

**Objetivo:** App React roteável conectada ao backend.

**Escopo:** Vite + TS + React Router, `api/client.ts`, tipos, layout base.

**Critérios de pronto:**

- [ ] Rotas: `/`, `/topics`, `/cards/new`, `/study/:topicId`, `/study/random`
- [ ] `VITE_API_URL` funciona
- [ ] Erros de rede exibidos de forma básica

**Depende de:** Etapas 1, 4

---



### Etapa 6 — Frontend: Tópicos (`/topics`)

**Objetivo:** Listar e criar tópicos.

**Escopo:** `TopicsPage`, `TopicList`, `TopicForm`.

**Critérios de pronto:**

- [ ] Lista tópicos da API
- [ ] Form cria tópico com validação 60 chars
- [ ] Erro 409 exibido para nome duplicado
- [ ] Empty state se zero tópicos

**Depende de:** Etapa 5

---



### Etapa 7 — Frontend: Cadastro de cards (`/cards/new`)

**Objetivo:** Criar cards com validação e UX anti-duplicata.

**Escopo:** `CardNewPage`, `CardForm`, `CharCounter`.

**Critérios de pronto:**

- [ ] Select de tópico
- [ ] Contadores em tempo real
- [ ] Submit com debounce/disable
- [ ] Validação espelha backend
- [ ] Feedback de sucesso/erro

**Depende de:** Etapas 5, 6

---



### Etapa 8 — Frontend: Home (`/`)

**Objetivo:** Hub de navegação com regras de bloqueio.

**Escopo:** `HomePage`, listagem tópicos com botão Estudar, botão Random.

**Critérios de pronto:**

- [ ] Lista tópicos + `card_count`
- [ ] "Estudar" desabilitado se `card_count === 0`
- [ ] "Random" desabilitado se total de cards === 0
- [ ] Empty states claros
- [ ] Links para `/topics` e `/cards/new`

**Depende de:** Etapas 5, 6, 7

---



### Etapa 9 — Core: `useStudySession` + shuffle

**Objetivo:** Máquina de estados simplificada no frontend.

**Escopo:** Hook, `shuffle.ts`, tipos de sessão.

**Critérios de pronto:**

- [ ] Conforme spec § Máquina de estados
- [ ] Sem `skippedIds`/rodadas
- [ ] Redirect quando sessão esgota ou zero cards

**Depende de:** Etapas 5, 4

---



### Etapa 10 — Frontend: Tela de estudo

**Objetivo:** UX Anki-like completa.

**Escopo:** `StudyPage`, `StudyCard`, `StudyActions`, `ExtendedPanel`, flip 3D + fallback.

**Critérios de pronto:**

- [ ] `/study/:topicId` e `/study/random`
- [ ] Uma carta por vez
- [ ] Virar opcional (flip 3D; fallback fade)
- [ ] `prefers-reduced-motion` desativa animação
- [ ] Descrição extendida só após virar + expandir painel
- [ ] Próxima sempre habilitada
- [ ] Sair → `/`
- [ ] Sessão esgotada → `/`
- [ ] Loading/erro se API falhar

**Depende de:** Etapas 8, 9

---



### Etapa 11 — Polimento UX e acessibilidade

**Objetivo:** MVP apresentável.

**Escopo:** Empty states consistentes, foco teclado básico, responsivo mobile.

**Critérios de pronto:**

- [ ] Empty states em todas as telas
- [ ] Botões com labels acessíveis
- [ ] Layout funcional em viewport mobile
- [ ] Painel lateral colapsa abaixo do card em telas estreitas
- [ ] Descrição extendida nunca visível antes do flip

**Depende de:** Etapas 8, 10

---



### Etapa 12 — Documentação e smoke test final

**Objetivo:** Repo entregável.

**Escopo:** README completo, smoke manual documentado.

**Critérios de pronto:**

- [ ] Fluxo manual: criar tópico → card → estudar → random
- [ ] Menciona que seed/fixtures ficam para depois
- [ ] Variáveis de env listadas
- [ ] Desenvolvedor sobe o projeto em < 10 min

**Depende de:** Todas anteriores

---



## Diagrama de dependências

```
[E1 Infra/Docker]
       │
       ▼
[E2 Models/DB] ──► [E3 Schemas] ──► [E4 API]
                                           │
[E5 Frontend scaffold] ◄───────────────────┘
       │
       ├──► [E6 Topics] ──► [E7 Cards] ──► [E8 Home]
       │
       └──► [E9 useStudySession] ──► [E10 Study UI]
                                              │
                                              ▼
                                    [E11 Polish] ──► [E12 Docs]
```

**Ordem linear:** 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12

---



## Fora do MVP (v2+)


| Item                               | Motivo                            |
| ---------------------------------- | --------------------------------- |
| Auth / login                       | Decisão explícita                 |
| Editar/excluir tópicos e cards     | Escopo reduzido                   |
| Spaced repetition (SM-2)           | Complexidade                      |
| Rodadas / cards pulados que voltam | Máquina simplificada              |
| Persistência de sessão             | Refresh perde sessão              |
| Seed/fixtures automatizados        | Script será criado depois         |
| Paginação de cards                 | Assume < 200 cards                |
| Testes automatizados (E2E/unit)    | Não solicitados no MVP            |
| Deploy produção (CI/CD, nginx)     | Infra preparada, não implementada |
| Busca/filtro de tópicos            | Nice-to-have                      |


---



## Riscos e mitigações


| Risco                          | Mitigação                                    |
| ------------------------------ | -------------------------------------------- |
| Flip 3D quebrado no Safari/iOS | Fallback fade/swap; `prefers-reduced-motion` |
| Duplicata no double-submit     | Debounce + disable no submit                 |
| Tópico duplicado               | Index `LOWER(name)` + HTTP 409               |
| CORS mal configurado           | `CORS_ORIGINS` documentado                   |
| Sessão perdida no refresh      | Documentar no README; v2 com localStorage    |
| Performance com muitos cards   | MVP assume < 200 cards                       |
| Zero cards no random           | Redirect imediato para `/`                   |
| Extendida vazando na pergunta  | `ExtendedPanel` só renderiza se `isFlipped`  |


---



## Smoke test manual (pós-MVP)

1. `cp .env.example .env && docker compose up`
2. Acessar `http://localhost:5173`
3. Ir em **Tópicos** → criar "Python"
4. Ir em **Novo Card** → cadastrar pergunta/resposta
5. Na **Home** → clicar **Estudar** no tópico
6. Virar carta → abrir descrição extendida (se houver) → **Próxima**
7. **Sair** ou esgotar cards → volta à home
8. Clicar **Random** → estudar cards de todos os tópicos

