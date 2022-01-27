from sqlalchemy.sql import func

from .db import db


class UnitPrice(db.Model):
    __tablename__ = "unit_prices"

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(
        db.Integer, db.ForeignKey("properties.id", ondelete="CASCADE"), nullable=False
    )
    unit_category_id = db.Column(
        db.Integer, db.ForeignKey("unit_categories.id"), nullable=False
    )
    price = db.Column(db.Integer, nullable=False)
    sq_ft = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "propertyId": self.property_id,
            "unitCategoryId": self.unit_category_id,
            "price": self.price / 100,
            "sqFt": self.sq_ft,
            "createdAt": self.created_at,
        }
