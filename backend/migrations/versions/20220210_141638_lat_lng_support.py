"""lat lng support

Revision ID: e940b3e69eb8
Revises: ca8ea2326e45
Create Date: 2022-02-10 14:16:38.544593

"""
from alembic import op
import sqlalchemy as sa

from app.utils.maps import Address


# revision identifiers, used by Alembic.
revision = "e940b3e69eb8"
down_revision = "ca8ea2326e45"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("properties", sa.Column("lat", sa.DECIMAL(), nullable=True))
    op.add_column("properties", sa.Column("lng", sa.DECIMAL(), nullable=True))

    # Update existing properties to add lat and lng
    properties_table = sa.Table(
        "properties",
        sa.MetaData(),
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("address_1", sa.String(), nullable=False),
        sa.Column("address_2", sa.String(), nullable=True),
        sa.Column("city", sa.String(), nullable=False),
        sa.Column("state", sa.String(), nullable=False),
        sa.Column("zip_code", sa.String(), nullable=False),
        sa.Column("lat", sa.DECIMAL(), nullable=False),
        sa.Column("lng", sa.DECIMAL(), nullable=False),
    )

    connection = op.get_bind()

    results = connection.execute(
        sa.select(
            [
                properties_table.c.id,
                properties_table.c.address_1,
                properties_table.c.address_2,
                properties_table.c.city,
                properties_table.c.state,
                properties_table.c.zip_code,
                properties_table.c.lat,
                properties_table.c.lng,
            ]
        )
    ).fetchall()

    for result in results:
        id, address_1, address_2, city, state, zip_code, lat, lng = result
        address = Address(
            address_1=address_1,
            address_2=address_2,
            city=city,
            state=state,
            zip_code=zip_code,
        )

        lat, lng = address.geocode_lat_lng()

        connection.execute(
            properties_table.update()
            .where(properties_table.c.id == id)
            .values(
                lat=lat,
                lng=lng,
            )
        )

    # After updating all results, change the columns to be not nullable
    op.alter_column("properties", "lat", nullable=False)
    op.alter_column("properties", "lng", nullable=False)


def downgrade():
    op.drop_column("properties", "lng")
    op.drop_column("properties", "lat")
