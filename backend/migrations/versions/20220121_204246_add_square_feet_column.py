"""add square feet column

Revision ID: 673cfb5ad5ce
Revises: 0b09189dd8fa
Create Date: 2022-01-21 20:42:46.463823

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "673cfb5ad5ce"
down_revision = "0b09189dd8fa"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("property_units", sa.Column("sq_ft", sa.Integer(), nullable=False))
    op.add_column("unit_prices", sa.Column("sq_ft", sa.Integer(), nullable=False))


def downgrade():
    op.drop_column("unit_prices", "sq_ft")
    op.drop_column("property_units", "sq_ft")
