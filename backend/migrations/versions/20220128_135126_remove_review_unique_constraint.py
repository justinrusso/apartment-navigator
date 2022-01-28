"""remove review unique constraint

Revision ID: 91ffc845f493
Revises: 7778a9e5b938
Create Date: 2022-01-28 13:51:26.636986

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "91ffc845f493"
down_revision = "7778a9e5b938"
branch_labels = None
depends_on = None


def upgrade():
    op.drop_constraint("uc_property_user", "reviews", type_="unique")


def downgrade():
    op.create_unique_constraint(
        "uc_property_user", "reviews", ["property_id", "user_id"]
    )
