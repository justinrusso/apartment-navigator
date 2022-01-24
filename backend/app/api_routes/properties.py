from flask import Blueprint, request
from flask_login import current_user, login_required
from sqlalchemy.orm import joinedload

from app.forms import validation_errors_to_dict
from app.forms.property_form import PropertyForm
from app.models import db, Property, PropertyCategory, PropertyImage, PropertyUnit


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

        if form.data["images"]:
            for imageUrl in form.data["images"]:
                property.images.append(PropertyImage(url=imageUrl))

        db.session.add(property)
        db.session.commit()
        return property.to_dict()
    return {"errors": validation_errors_to_dict(form.errors)}, 400


@properties_routes.route("/categories")
def property_categories():
    return {
        "categories": [category.to_dict() for category in PropertyCategory.query.all()]
    }
