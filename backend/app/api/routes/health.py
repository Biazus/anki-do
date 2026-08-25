from sqlalchemy import text

from fastapi import APIRouter

from app.config import settings
from app.database import engine

router = APIRouter()


def _check_db() -> str:
    if not settings.database_url or engine is None:
        return "not_configured"

    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return "connected"
    except Exception:
        return "disconnected"


@router.get("/health")
def health():
    return {"status": "ok", "db": _check_db()}
