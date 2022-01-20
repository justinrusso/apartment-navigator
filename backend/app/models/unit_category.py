from .db import db


class UnitCategory(db.Model):
    __tablename__ = "unit_categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
        }
