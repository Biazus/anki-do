"""initial topics and cards

Revision ID: 001
Revises:
Create Date: 2026-08-25

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "topics",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(length=60), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.execute(
        "CREATE UNIQUE INDEX ix_topics_name_lower ON topics (LOWER(name))"
    )

    op.create_table(
        "cards",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("topic_id", sa.Integer(), nullable=False),
        sa.Column("question", sa.String(length=280), nullable=False),
        sa.Column("answer", sa.String(length=800), nullable=False),
        sa.Column("extended_description", sa.String(length=3000), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["topic_id"],
            ["topics.id"],
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_cards_topic_id", "cards", ["topic_id"])


def downgrade() -> None:
    op.drop_index("ix_cards_topic_id", table_name="cards")
    op.drop_table("cards")
    op.drop_index("ix_topics_name_lower", table_name="topics")
    op.drop_table("topics")
