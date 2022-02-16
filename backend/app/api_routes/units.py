from flask import Blueprint, request
from flask_login import current_user, login_required
from munch import DefaultMunch

from app.forms import pick_patched_data
from app.forms.csrf_form import CSRFForm
from app.forms.unit_form import MultiUnitForm, SingleUnitForm
from app.models import PropertyUnit, UnitCategory, UnitPrice, db


units_routes = Blueprint("units", __name__, url_prefix="/units")


@units_routes.route("/<int:unit_id>", methods=["PATCH"])
@login_required
def edit_unit(unit_id):
    unit = PropertyUnit.query.get(unit_id)

    if not unit:
        return {"error": "Not Found"}, 404
    if unit.property.owner.id != current_user.id:
        return {"error": "Forbidden"}, 403

    UnitForm = SingleUnitForm if unit.property.category_id == 1 else MultiUnitForm

    body_data = request.get_json()

    form = UnitForm(
        formdata=None,
        obj=DefaultMunch.fromDict(
            {
                "unitNum": pick_patched_data(body_data.get("unitNum"), unit.unit_num),
                "unitCategoryId": pick_patched_data(
                    body_data.get("unitCategoryId"), unit.unit_category_id
                ),
                "baths": pick_patched_data(body_data.get("baths"), unit.baths),
                "price": pick_patched_data(body_data.get("price"), unit.price.price),
                "sqFt": pick_patched_data(body_data.get("sqFt"), unit.sq_ft),
                "floorPlanImg": pick_patched_data(
                    body_data.get("floorPlanImg"), unit.floor_plan_img
                ),
            }
        ),
    )

    form.csrf_token.data = request.cookies["csrf_token"]
    form["unitCategoryId"].choices = [(c.id, c.name) for c in UnitCategory.query.all()]

    if form.validate_on_submit():
        if (
            body_data.get("price")
            and int(float(body_data.get("price")) * 100) != unit.price.price
        ):
            unit.price = UnitPrice(
                property_id=unit.property.id,
                unit_category_id=form.data["unitCategoryId"],
                price=int(float(form.data["price"]) * 100),
                sq_ft=form.data["sqFt"],
            )
        unit.unit_num = form.data.get("unitNum")
        unit.unit_category_id = form.data["unitCategoryId"]
        unit.baths = form.data["baths"]
        unit.sq_ft = form.data["sqFt"]
        unit.floor_plan_img = form.data["floorPlanImg"]

        db.session.add(unit)
        db.session.commit()
        return unit.to_dict()
    return {"errors": form.errors}, 400


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
    return {"errors": form.errors}, 400


@units_routes.route("/categories")
def property_categories():
    return {"categories": [category.to_dict() for category in UnitCategory.query.all()]}
