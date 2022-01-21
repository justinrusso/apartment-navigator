from .db import db


class PropertyImage(db.Model):
    __tablename__ = "property_images"

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(
        db.Integer, db.ForeignKey("properties.id", ondelete="CASCADE"), nullable=False
    )
    unit_id = db.Column(
        db.Integer,
        db.ForeignKey("property_units.id", ondelete="CASCADE"),
        nullable=True,
    )
    url = db.Column(db.String, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "propertyId": self.property_id,
            "unitId": self.unit_id,
            "url": self.url,
        }
