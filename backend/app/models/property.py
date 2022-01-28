from sqlalchemy.sql import func

from .db import db
from .review_summary import ReviewSummary


class Property(db.Model):
    __tablename__ = "properties"

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    category_id = db.Column(
        db.Integer, db.ForeignKey("property_categories.id"), nullable=False
    )
    built_in_year = db.Column(db.SmallInteger, nullable=False)
    name = db.Column(db.String, nullable=True)
    address_1 = db.Column(db.String, nullable=False)
    address_2 = db.Column(db.String, nullable=True)
    city = db.Column(db.String, nullable=False)
    state = db.Column(db.String, nullable=False)
    zip_code = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)
    updated_at = db.Column(
        db.DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    category = db.relationship("PropertyCategory", backref="properties")
    images = db.relationship(
        "PropertyImage", backref=db.backref("property"), passive_deletes=True
    )
    review_summary = db.relationship(
        "ReviewSummary",
        backref=db.backref("property"),
        passive_deletes=True,
        uselist=False,
    )
    reviews = db.relationship(
        "Review",
        backref=db.backref("property"),
        passive_deletes=True,
        order_by="desc(Review.updated_at)",
    )
    units = db.relationship(
        "PropertyUnit", backref=db.backref("property"), passive_deletes=True
    )

    def to_dict(self):
        if not self.review_summary:
            self.review_summary = ReviewSummary(total=0, total_rating=0)

        return {
            "id": self.id,
            "owner": self.owner.to_dict(),
            "category": self.category.to_dict(),
            "builtInYear": self.built_in_year,
            "name": self.name,
            "address1": self.address_1,
            "address2": self.address_2,
            "city": self.city,
            "state": self.state,
            "zipCode": self.zip_code,
            "images": [image.to_dict() for image in self.images],
            "units": [unit.to_dict() for unit in self.units],
            "createdAt": self.created_at,
            "updatedAt": self.updated_at,
            "reviewSummary": self.review_summary.to_dict(),
        }
