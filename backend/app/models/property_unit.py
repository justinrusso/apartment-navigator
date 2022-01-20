from sqlalchemy.sql import func

from .db import db


class PropertyUnit(db.Model):
    __tablename__ = "property_units"

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey("properties.id"), nullable=False)
    unit_category_id = db.Column(
        db.Integer, db.ForeignKey("unit_categories.id"), nullable=False
    )
    baths = db.Column(db.SmallInteger, nullable=False)
    price_id = db.Column(db.Integer, db.ForeignKey("unit_prices.id"), nullable=False)
    floor_plan_img = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)
    updated_at = db.Column(
        db.DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    def to_dict(self):
        return {
            "id": self.id,
            "propertyId": self.property_id,
            "unitCategoryId": self.unit_category_id,
            "baths": self.baths,
            "priceId": self.price_id,
            "floorPlanImg": self.floor_plan_img,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at,
        }
