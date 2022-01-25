from flask import Blueprint, request
from flask_login import current_user, login_required
from sqlalchemy.orm import joinedload

from app.forms import validation_errors_to_dict
from app.forms.csrf_form import CSRFForm
from app.forms.property_form import PropertyForm
from app.models import (
    db,
    Property,
    PropertyCategory,
    PropertyImage,
    PropertyUnit,
    UnitPrice,
)


properties_routes = Blueprint("properties", __name__, url_prefix="/properties")


@properties_routes.route("/")
def index():
    properties = Property.query.all()
    return {"properties": [property.to_dict() for property in properties]}


@properties_routes.route("/<int:property_id>")
def get_property(property_id):
    property = Property.query.options(
        joinedload(Property.owner),
        joinedload(Property.category),
        joinedload(Property.units).joinedload(PropertyUnit.unit_category),
        joinedload(Property.units).joinedload(PropertyUnit.images),
        joinedload(Property.units).joinedload(PropertyUnit.price),
        joinedload(Property.images),
    ).get(property_id)

    if not property:
        return {}, 404
    return property.to_dict()


@properties_routes.route("/", methods=["POST"])
@login_required
def create_property():
    form = PropertyForm()
    form.csrf_token.data = request.cookies["csrf_token"]
    form["ownerId"].data = current_user.id
    form["categoryId"].choices = [
        (c.id, c.name) for c in PropertyCategory.query.order_by("name")
    ]

    if form.validate_on_submit():
        property = Property(
            owner_id=form.data["ownerId"],
            category_id=form.data["categoryId"],
            built_in_year=form.data["builtInYear"],
            name=form.data["name"],
            address_1=form.data["address1"],
            address_2=form.data["address2"],
            city=form.data["city"],
            state=form.data["state"],
            zip_code=form.data["zipCode"],
        )

        #  Write pending changes to db so we can get the property id for unit_prices
        db.session.add(property)
        db.session.flush()

        if form.data["images"]:
            for imageUrl in form.data["images"]:
                property.images.append(PropertyImage(url=imageUrl))
        if form.data["units"]:
            for unit_data in form.data["units"]:
                unit = PropertyUnit(
                    unit_num=unit_data["unitNum"],
                    unit_category_id=int(unit_data["unitCategoryId"]),
                    baths=int(unit_data["baths"]),
                    price=UnitPrice(
                        property_id=property.id,
                        unit_category_id=int(unit_data["unitCategoryId"]),
                        price=int(unit_data["price"]),
                        sq_ft=int(unit_data["sqFt"]),
                    ),
                    sq_ft=unit_data["sqFt"],
                    floor_plan_img=unit_data["floorPlanImg"],
                )
                property.units.append(unit)

        db.session.commit()
        return property.to_dict()
    return {"errors": validation_errors_to_dict(form.errors)}, 400


@properties_routes.route("/<int:property_id>", methods=["DELETE"])
@login_required
def delete_property(property_id):
    form = CSRFForm()
    form.csrf_token.data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        property = Property.query.get(property_id)

        if not property:
            return {"error": "Not Found"}, 404
        if property.owner.id != current_user.id:
            return {"error": "Forbidden"}, 403

        db.session.delete(property)
        db.session.commit()
        return {"id": property_id}
    return {"errors": validation_errors_to_dict(form.errors)}, 400


@properties_routes.route("/categories")
def property_categories():
    return {
        "categories": [category.to_dict() for category in PropertyCategory.query.all()]
    }
