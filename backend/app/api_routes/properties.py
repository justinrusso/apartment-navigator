from flask import Blueprint, request
from flask_login import current_user, login_required
from munch import DefaultMunch
from sqlalchemy.orm import joinedload

from app.forms import pick_patched_data, validation_errors_to_dict
from app.forms.csrf_form import CSRFForm
from app.forms.property_form import PropertyForm
from app.forms.property_image_form import PropertyImageForm
from app.forms.unit_form import MultiUnitForm, SingleUnitForm
from app.models import (
    db,
    Property,
    PropertyCategory,
    PropertyImage,
    PropertyUnit,
    UnitCategory,
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


@properties_routes.route("/<int:property_id>", methods=["PATCH"])
@login_required
def edit_property(property_id):
    property = Property.query.get(property_id)

    if not property:
        return {"error": "Not Found"}, 404
    if property.owner.id != current_user.id:
        return {"error": "Forbidden"}, 403

    body_data = request.get_json()

    form = PropertyForm(
        formdata=None,
        obj=DefaultMunch.fromDict(
            {
                "ownerId": pick_patched_data(
                    body_data.get("ownerId"), property.owner_id
                ),
                "categoryId": pick_patched_data(
                    body_data.get("categoryId"), property.category_id
                ),
                "builtInYear": pick_patched_data(
                    body_data.get("builtInYear"), property.built_in_year
                ),
                "name": pick_patched_data(body_data.get("name"), property.name),
                "address1": pick_patched_data(
                    body_data.get("address1"), property.address_1
                ),
                "address2": pick_patched_data(
                    body_data.get("address2"), property.address_2
                ),
                "city": pick_patched_data(body_data.get("city"), property.city),
                "state": pick_patched_data(body_data.get("state"), property.state),
                "zipCode": pick_patched_data(
                    body_data.get("zipCode"), property.zip_code
                ),
            }
        ),
    )
    form.csrf_token.data = request.cookies["csrf_token"]
    form["categoryId"].choices = [
        (c.id, c.name) for c in PropertyCategory.query.order_by("name")
    ]

    if form.validate_on_submit():
        property.built_in_year = form.data["builtInYear"]
        property.name = form.data["name"]
        property.address_1 = form.data["address1"]
        property.address_2 = form.data["address2"]
        property.city = form.data["city"]
        property.state = form.data["state"]
        property.zip_code = form.data["zipCode"]
        db.session.add(property)
        db.session.commit()
        return property.to_dict()
    return {"errors": validation_errors_to_dict(form.errors)}, 400


@properties_routes.route("/<int:property_id>", methods=["DELETE"])
@login_required
def delete_property(property_id):
    form = CSRFForm()

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


@properties_routes.route("/<int:property_id>/images", methods=["POST"])
@login_required
def add_property_image(property_id):
    form = PropertyImageForm()
    form.csrf_token.data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        property = Property.query.get(property_id)

        if not property:
            return {"error": "Not Found"}, 404
        if property.owner.id != current_user.id:
            return {"error": "Forbidden"}, 403

        image = PropertyImage(url=form.data["imageUrl"])
        property.images.append(image)

        db.session.add(property)
        db.session.commit()
        return image.to_dict()
    return {"errors": validation_errors_to_dict(form.errors)}, 400


@properties_routes.route("/<int:property_id>/units", methods=["POST"])
@login_required
def add_property_unit(property_id):
    property = Property.query.get(property_id)
    if not property:
        return {"error": "Not Found"}, 404
    if property.owner.id != current_user.id:
        return {"error": "Forbidden"}, 403

    UnitForm = SingleUnitForm if property.category_id == 1 else MultiUnitForm
    form = UnitForm()
    form.csrf_token.data = request.cookies["csrf_token"]
    form["unitCategoryId"].choices = [(c.id, c.name) for c in UnitCategory.query.all()]

    if form.validate_on_submit():
        unit = PropertyUnit(
            price=UnitPrice(
                property_id=property.id,
                unit_category_id=form.data["unitCategoryId"],
                price=form.data["price"],
                sq_ft=form.data["sqFt"],
            ),
            unit_num=form.data.get("unitNum"),
            unit_category_id=form.data["unitCategoryId"],
            baths=form.data["baths"],
            sq_ft=form.data["sqFt"],
            floor_plan_img=form.data["floorPlanImg"],
        )
        property.units.append(unit)

        db.session.add(property)
        db.session.commit()
        return unit.to_dict()
    return {"errors": validation_errors_to_dict(form.errors)}, 400


@properties_routes.route("/categories")
def property_categories():
    return {
        "categories": [category.to_dict() for category in PropertyCategory.query.all()]
    }
