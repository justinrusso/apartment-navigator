from flask import Blueprint
from flask_login import current_user, login_required

from app.forms import validation_errors_to_dict
from app.forms.csrf_form import CSRFForm
from app.models import PropertyUnit, UnitCategory, db


units_routes = Blueprint("units", __name__, url_prefix="/units")


@units_routes.route("/<int:unit_id>", methods=["DELETE"])
@login_required
def delete_unit(unit_id):
    form = CSRFForm()

    if form.validate_on_submit():
        unit = PropertyUnit.query.get(unit_id)

        if not unit:
            return {"error": "Not Found"}, 404
        if unit.property.owner.id != current_user.id:
            return {"error": "Forbidden"}, 403

        db.session.delete(unit)
        db.session.commit()
        return {"id": unit_id}
    return {"errors": validation_errors_to_dict(form.errors)}, 400


@units_routes.route("/categories")
def property_categories():
    return {"categories": [category.to_dict() for category in UnitCategory.query.all()]}
