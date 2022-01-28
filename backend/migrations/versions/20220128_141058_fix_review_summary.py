""" fix review summary

Revision ID: ca8ea2326e45
Revises: 91ffc845f493
Create Date: 2022-01-28 14:10:58.767649

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "ca8ea2326e45"
down_revision = "91ffc845f493"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "review_summaries", sa.Column("total_rating", sa.Integer(), nullable=False)
    )
    op.drop_column("review_summaries", "average_rating")


def downgrade():
    op.add_column(
        "review_summaries",
        sa.Column("average_rating", sa.SMALLINT(), autoincrement=False, nullable=False),
    )
    op.drop_column("review_summaries", "total_rating")
