from sqlalchemy.sql import func

from .db import db


class Property(db.Model):
    __tablename__ = "properties"

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    category_id = db.Column(
        db.Integer, db.ForeignKey("property_categories.id"), nullable=False
    )
    built_in_year = db.Column(db.SmallInteger, nullable=False)
    address_1 = db.Column(db.String, nullable=False)
    address_2 = db.Column(db.String, nullable=True)
    city = db.Column(db.String, nullable=False)
    state = db.Column(db.String, nullable=False)
    zip_code = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)
    updated_at = db.Column(
        db.DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    def to_dict(self):
        return {
            "id": self.id,
            "ownerId": self.owner_id,
            "categoryId": self.category_id,
            "builtInYear": self.built_in_year,
            "address1": self.address_1,
            "address2": self.address_2,
            "city": self.city,
            "state": self.state,
            "zipCode": self.zip_code,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at,
        }
