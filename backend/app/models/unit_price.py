from sqlalchemy.sql import func

from .db import db


class UnitPrice(db.Model):
    __tablename__ = "unit_prices"

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey("properties.id"), nullable=False)
    unit_category_id = db.Column(
        db.Integer, db.ForeignKey("unit_categories.id"), nullable=False
    )
    price = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "property_id": self.property_id,
            "unit_category_id": self.unit_category_id,
            "price": self.price,
            "created_at": self.created_at,
        }
