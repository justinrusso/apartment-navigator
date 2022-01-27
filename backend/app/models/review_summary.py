from .db import db


class ReviewSummary(db.Model):
    __tablename__ = "review_summaries"

    property_id = db.Column(
        db.Integer, db.ForeignKey("properties.id", ondelete="CASCADE"), primary_key=True
    )
    total = db.Column(db.Integer, nullable=False)
    average_rating = db.Column(db.SmallInteger, nullable=False)

    def to_dict(self):
        return {
            "propertyId": self.property_id,
            "total": self.total,
            "averageRating": self.average_rating,
        }
