from sqlalchemy.sql import func

from .db import db


class PropertyUnit(db.Model):
    __tablename__ = "property_units"

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(
        db.Integer, db.ForeignKey("properties.id", ondelete="CASCADE"), nullable=False
    )
    unit_num = db.Column(db.String, nullable=True)
    unit_category_id = db.Column(
        db.Integer, db.ForeignKey("unit_categories.id"), nullable=False
    )
    baths = db.Column(db.SmallInteger, nullable=False)
    price_id = db.Column(db.Integer, db.ForeignKey("unit_prices.id"), nullable=False)
    sq_ft = db.Column(db.Integer, nullable=False)
    floor_plan_img = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)
    updated_at = db.Column(
        db.DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        db.UniqueConstraint("property_id", "unit_num", name="uc_property_unit_num"),
    )

    images = db.relationship(
        "PropertyImage", backref=db.backref("property_unit", passive_deletes=True)
    )
    price = db.relationship("UnitPrice", backref="property_unit")
    unit_category = db.relationship("UnitCategory", backref="property_units")

    def to_dict(self):
        return {
            "id": self.id,
            "propertyId": self.property_id,
            "unitNum": self.unit_num,
            "unitCategory": self.unit_category.to_dict(),
            "baths": self.baths,
            "price": self.price.to_dict(),
            "sqFt": self.sq_ft,
            "images": [image.to_dict() for image in self.images],
            "floorPlanImg": self.floor_plan_img,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at,
        }
