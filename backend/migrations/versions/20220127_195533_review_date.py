"""review date

Revision ID: 7778a9e5b938
Revises: 24a15791e7ab
Create Date: 2022-01-27 19:55:33.706821

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "7778a9e5b938"
down_revision = "24a15791e7ab"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "reviews",
        sa.Column(
            "created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False
        ),
    )
    op.add_column(
        "reviews",
        sa.Column(
            "updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False
        ),
    )


def downgrade():
    op.drop_column("reviews", "updated_at")
    op.drop_column("reviews", "created_at")
