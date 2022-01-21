"""add name to properties

Revision ID: 0b09189dd8fa
Revises: 64f2ed5e6827
Create Date: 2022-01-21 13:53:42.299850

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0b09189dd8fa"
down_revision = "64f2ed5e6827"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("properties", sa.Column("name", sa.String(), nullable=True))


def downgrade():
    op.drop_column("properties", "name")
