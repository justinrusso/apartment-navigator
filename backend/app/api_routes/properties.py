from flask import Blueprint, request
from flask_login import current_user, login_required

from app.forms import validation_errors_to_dict
from app.forms.property_form import PropertyForm
from app.models import db, Property, PropertyCategory, PropertyImage


properties_routes = Blueprint("properties", __name__, url_prefix="/properties")


@properties_routes.route("/", methods=["POST"])
@login_required
def index():
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
            address_1=form.data["address1"],
            address_2=form.data["address2"],
            city=form.data["city"],
            state=form.data["state"],
            zip_code=form.data["zipCode"],
        )

        for img_url in form.data["images"]:
            property.images.append(PropertyImage(url=img_url))

        db.session.add(property)
        db.session.commit()
        return property.to_dict()
    return {"errors": validation_errors_to_dict(form.errors)}, 400


@properties_routes.route("/categories")
def property_categories():
    return {
        "categories": [category.to_dict() for category in PropertyCategory.query.all()]
    }
