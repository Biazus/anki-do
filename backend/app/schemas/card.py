from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


class CardCreate(BaseModel):
    topic_id: int = Field(..., gt=0)
    question: str = Field(..., min_length=1, max_length=280)
    answer: str = Field(..., min_length=1, max_length=800)
    extended_description: str | None = Field(default=None, max_length=3000)


class CardRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    topic_id: int
    question: str
    answer: str
    extended_description: str | None
    created_at: datetime


class CardListQuery(BaseModel):
    topic_id: int | None = None
    random: bool = False

    @model_validator(mode="after")
    def validate_query_mode(self) -> "CardListQuery":
        has_topic = self.topic_id is not None
        has_random = self.random

        if has_topic == has_random:
            raise ValueError("Provide exactly one of topic_id or random=true")

        return self
