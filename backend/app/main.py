import os

import psycopg
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _check_db() -> str:
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        return "not_configured"

    psycopg_url = database_url.replace("postgresql+psycopg://", "postgresql://")

    try:
        with psycopg.connect(psycopg_url, connect_timeout=3) as conn:
            conn.execute("SELECT 1")
        return "connected"
    except Exception:
        return "disconnected"


@app.get("/health")
def health():
    return {"status": "ok", "db": _check_db()}
