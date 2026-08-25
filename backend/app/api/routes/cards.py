from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.card import Card
from app.models.topic import Topic
from app.schemas.card import CardCreate, CardRead

router = APIRouter()


@router.get("", response_model=list[CardRead])
def get_cards(
    topic_id: int | None = None,
    random: bool = Query(default=False),
    db: Session = Depends(get_db),
):
    has_topic = topic_id is not None
    if has_topic == random:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Provide exactly one of topic_id or random=true",
        )

    if random:
        cards = db.scalars(select(Card).order_by(Card.id)).all()
    else:
        cards = db.scalars(
            select(Card)
            .where(Card.topic_id == topic_id)
            .order_by(Card.id)
        ).all()

    return cards


@router.post("", response_model=CardRead, status_code=status.HTTP_201_CREATED)
def post_card(payload: CardCreate, db: Session = Depends(get_db)):
    topic = db.get(Topic, payload.topic_id)
    if topic is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found",
        )

    extended_description = payload.extended_description
    if extended_description is not None:
        extended_description = extended_description.strip() or None

    card = Card(
        topic_id=payload.topic_id,
        question=payload.question.strip(),
        answer=payload.answer.strip(),
        extended_description=extended_description,
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return card
