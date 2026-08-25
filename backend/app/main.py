from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import cards, health, topics
from app.config import settings

app = FastAPI(title="anki-do API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(topics.router, prefix="/topics", tags=["topics"])
app.include_router(cards.router, prefix="/cards", tags=["cards"])
