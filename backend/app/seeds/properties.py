import json
import os

from app.models import (
    db,
    Property,
    PropertyImage,
    PropertyUnit,
    ReviewSummary,
    UnitPrice,
)
from app.utils.maps import Address


def seed_properties():
    file_path = os.path.join(os.path.dirname(__file__), "properties.json")
    f = open(file_path, "r")
    data = json.load(f)

    for property_data in data.get("properties", []):
        address = Address(
            address_1=property_data.get("address_1"),
            address_2=property_data.get("address_2"),
            city=property_data.get("city"),
            state=property_data.get("state"),
            zip_code=property_data.get("zip_code"),
        )

        lat, lng = address.geocode_lat_lng()

        property = Property(
            owner_id=property_data.get("owner_id"),
            category_id=property_data.get("category_id"),
            built_in_year=property_data.get("built_in_year"),
            name=property_data.get("name"),
            address_1=property_data.get("address_1"),
            address_2=property_data.get("address_2"),
            city=property_data.get("city"),
            state=property_data.get("state"),
            zip_code=property_data.get("zip_code"),
            lat=lat,
            lng=lng,
            created_at=property_data.get("created_at"),
        )

        for image_url in property_data.get("images", []):
            property.images.append(PropertyImage(url=image_url))

        property.review_summary = ReviewSummary(total=0, total_rating=0)

        #  Write pending changes to db so we can get the property id for unit_prices
        db.session.add(property)
        db.session.flush()

        # Past unit prices
        # NOTE: The current price should be added to the unit directly
        for unit_price_data in property_data.get("past_unit_prices", []):
            unit_price = UnitPrice(
                property_id=property.id,
                unit_category_id=unit_price_data.get("unit_category_id"),
                price=unit_price_data.get("price"),
                sq_ft=unit_price_data.get("sq_ft"),
                created_at=unit_price_data.get("created_at"),
            )
            db.session.add(unit_price)

        for unit_data in property_data.get("units", []):
            property.units.append(
                PropertyUnit(
                    unit_num=unit_data.get("unit_num"),
                    unit_category_id=unit_data.get("unit_category_id"),
                    baths=unit_data.get("baths"),
                    price=UnitPrice(
                        property_id=property.id,
                        unit_category_id=unit_data.get("unit_category_id"),
                        price=unit_data.get("price").get("price"),
                        sq_ft=unit_data.get("sq_ft"),
                        created_at=unit_price_data.get("created_at"),
                    ),
                    sq_ft=unit_data.get("sq_ft"),
                    floor_plan_img=unit_data.get("floor_plan_img"),
                )
            )

    db.session.commit()


def undo_properties():
    db.session.execute("TRUNCATE properties RESTART IDENTITY CASCADE;")
    db.session.commit()
