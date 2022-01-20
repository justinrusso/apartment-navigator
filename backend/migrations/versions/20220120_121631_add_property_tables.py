"""add property tables

Revision ID: 64f2ed5e6827
Revises: e1cc55fc23a7
Create Date: 2022-01-20 12:16:31.357110

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "64f2ed5e6827"
down_revision = "e1cc55fc23a7"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "property_categories",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "unit_categories",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "properties",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("owner_id", sa.Integer(), nullable=False),
        sa.Column("category_id", sa.Integer(), nullable=False),
        sa.Column("built_in_year", sa.SmallInteger(), nullable=False),
        sa.Column("address_1", sa.String(), nullable=False),
        sa.Column("address_2", sa.String(), nullable=True),
        sa.Column("city", sa.String(), nullable=False),
        sa.Column("state", sa.String(), nullable=False),
        sa.Column("zip_code", sa.String(), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False
        ),
        sa.Column(
            "updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False
        ),
        sa.ForeignKeyConstraint(
            ["category_id"],
            ["property_categories.id"],
        ),
        sa.ForeignKeyConstraint(["owner_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "unit_prices",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("property_id", sa.Integer(), nullable=False),
        sa.Column("unit_category_id", sa.Integer(), nullable=False),
        sa.Column("price", sa.Integer(), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False
        ),
        sa.ForeignKeyConstraint(["property_id"], ["properties.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(
            ["unit_category_id"],
            ["unit_categories.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "property_units",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("property_id", sa.Integer(), nullable=False),
        sa.Column("unit_category_id", sa.Integer(), nullable=False),
        sa.Column("baths", sa.SmallInteger(), nullable=False),
        sa.Column("price_id", sa.Integer(), nullable=False),
        sa.Column("floor_plan_img", sa.String(), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False
        ),
        sa.Column(
            "updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False
        ),
        sa.ForeignKeyConstraint(
            ["price_id"],
            ["unit_prices.id"],
        ),
        sa.ForeignKeyConstraint(["property_id"], ["properties.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(
            ["unit_category_id"],
            ["unit_categories.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "property_images",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("property_id", sa.Integer(), nullable=False),
        sa.Column("unit_id", sa.Integer(), nullable=True),
        sa.Column("url", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(["property_id"], ["properties.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["unit_id"], ["property_units.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )

    # Insert categories
    property_categories_table = sa.table(
        "property_categories", sa.column("id", sa.Integer), sa.column("name", sa.String)
    )
    op.bulk_insert(
        property_categories_table,
        [
            {"id": 1, "name": "Single Unit"},
            {"id": 2, "name": "Multiple Unit"},
        ],
    )
    unit_categories_table = sa.table(
        "unit_categories", sa.column("id", sa.Integer), sa.column("name", sa.String)
    )
    op.bulk_insert(
        unit_categories_table,
        [
            {"id": 1, "name": "Studio"},
            {"id": 2, "name": "1 Bedroom"},
            {"id": 3, "name": "2 Bedrooms"},
            {"id": 4, "name": "3 Bedrooms"},
            {"id": 5, "name": "4 Bedrooms"},
            {"id": 6, "name": "5 Bedrooms"},
            {"id": 7, "name": "6 Bedrooms"},
            {"id": 8, "name": "7+ Bedrooms"},
        ],
    )


def downgrade():
    op.drop_table("property_images")
    op.drop_table("property_units")
    op.drop_table("unit_prices")
    op.drop_table("properties")
    op.drop_table("unit_categories")
    op.drop_table("property_categories")
