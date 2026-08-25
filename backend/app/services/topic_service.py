from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.card import Card
from app.models.topic import Topic


def find_topic_by_name_insensitive(db: Session, name: str) -> Topic | None:
    normalized = name.strip()
    return db.scalar(
        select(Topic).where(func.lower(Topic.name) == normalized.lower())
    )


def list_topics_with_counts(db: Session) -> list[tuple[Topic, int]]:
    rows = db.execute(
        select(Topic, func.count(Card.id).label("card_count"))
        .outerjoin(Card)
        .group_by(Topic.id)
        .order_by(Topic.name)
    ).all()
    return [(topic, card_count) for topic, card_count in rows]


def create_topic(db: Session, name: str) -> Topic:
    topic = Topic(name=name.strip())
    db.add(topic)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise exc
    db.refresh(topic)
    return topic
