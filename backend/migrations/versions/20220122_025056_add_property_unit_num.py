"""add property unit number column

Revision ID: 69a69c6cdd4a
Revises: 673cfb5ad5ce
Create Date: 2022-01-22 02:50:56.177179

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "69a69c6cdd4a"
down_revision = "673cfb5ad5ce"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("property_units", sa.Column("unit_num", sa.String(), nullable=True))
    op.create_unique_constraint(
        "uc_property_unit_num", "property_units", ["property_id", "unit_num"]
    )


def downgrade():
    op.drop_constraint("uc_property_unit_num", "property_units", type_="unique")
    op.drop_column("property_units", "unit_num")
