"""add reviews and review_summaries tables

Revision ID: 24a15791e7ab
Revises: 69a69c6cdd4a
Create Date: 2022-01-27 15:05:09.903109

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "24a15791e7ab"
down_revision = "69a69c6cdd4a"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "review_summaries",
        sa.Column("property_id", sa.Integer(), nullable=False),
        sa.Column("total", sa.Integer(), nullable=False),
        sa.Column("average_rating", sa.SmallInteger(), nullable=False),
        sa.ForeignKeyConstraint(["property_id"], ["properties.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("property_id"),
    )
    op.create_table(
        "reviews",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("property_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("rating", sa.SmallInteger(), nullable=False),
        sa.Column("comment", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(["property_id"], ["properties.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("property_id", "user_id", name="uc_property_user"),
    )


def downgrade():
    op.drop_table("reviews")
    op.drop_table("review_summaries")
