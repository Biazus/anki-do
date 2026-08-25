from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.topic import TopicCreate, TopicRead
from app.services.topic_service import create_topic, find_topic_by_name_insensitive, list_topics_with_counts

router = APIRouter()


@router.get("", response_model=list[TopicRead])
def get_topics(db: Session = Depends(get_db)):
    rows = list_topics_with_counts(db)
    return [
        TopicRead(
            id=topic.id,
            name=topic.name,
            card_count=card_count,
            created_at=topic.created_at,
        )
        for topic, card_count in rows
    ]


@router.post("", response_model=TopicRead, status_code=status.HTTP_201_CREATED)
def post_topic(payload: TopicCreate, db: Session = Depends(get_db)):
    name = payload.name.strip()

    if find_topic_by_name_insensitive(db, name):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Topic with this name already exists",
        )

    try:
        topic = create_topic(db, name)
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Topic with this name already exists",
        ) from None

    return TopicRead(
        id=topic.id,
        name=topic.name,
        card_count=0,
        created_at=topic.created_at,
    )
