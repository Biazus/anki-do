from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TopicCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=60)


class TopicRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    card_count: int | None = None
    created_at: datetime
