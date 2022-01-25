from flask import Blueprint
from app.models import UnitCategory


units_routes = Blueprint("units", __name__, url_prefix="/units")


@units_routes.route("/categories")
def property_categories():
    return {"categories": [category.to_dict() for category in UnitCategory.query.all()]}
