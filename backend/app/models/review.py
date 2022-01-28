from sqlalchemy.sql import func

from .db import db


class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(
        db.Integer, db.ForeignKey("properties.id", ondelete="CASCADE"), nullable=False
    )
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    rating = db.Column(db.SmallInteger, nullable=False)
    comment = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)
    updated_at = db.Column(
        db.DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        db.UniqueConstraint("property_id", "user_id", name="uc_property_user"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "propertyId": self.property_id,
            "userId": self.user_id,
            "rating": self.rating,
            "comment": self.comment,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at,
        }
