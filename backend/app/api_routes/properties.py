from flask import Blueprint, request
from flask_login import current_user, login_required
from marshmallow import ValidationError
from munch import DefaultMunch
from sqlalchemy import or_
from sqlalchemy.orm import joinedload

from app.forms import pick_patched_data, validation_errors_to_dict
from app.forms.csrf_form import CSRFForm
from app.forms.property_form import PropertyForm
from app.forms.property_image_form import PropertyImageForm
from app.forms.review_form import ReviewForm
from app.forms.unit_form import MultiUnitForm, SingleUnitForm
from app.models import (
    db,
    Property,
    PropertyCategory,
    PropertyImage,
    PropertyUnit,
    Review,
    ReviewSummary,
    UnitCategory,
    UnitPrice,
)
from app.schemas.property_schema import MultiPropertySchema, SinglePropertySchema
from app.utils.maps import Address


properties_routes = Blueprint("properties", __name__, url_prefix="/properties")


@properties_routes.route("/")
def index():
    key = request.args.get("key")

    filters = []
    if key:
        filters.append(
            or_(
                Property.name.ilike(f"%{key}%"),
                Property.city.ilike(f"%{key}%"),
                Property.state.ilike(f"%{key}%"),
            )
        )

    properties = Property.query.filter(*filters).all()
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
    form = CSRFForm()

    body_data: dict = request.get_json()
    body_data["ownerId"] = current_user.id

    PropertySchema = (
        SinglePropertySchema
        if int(body_data["categoryId"]) == 1
        else MultiPropertySchema
    )

    if form.validate_on_submit():
        try:
            result = PropertySchema().load(body_data)
        except ValidationError as error:
            return {"errors": error.messages}, 400

        address = Address(
            address_1=result["address_1"],
            address_2=result["address_2"],
            city=result["city"],
            state=result["state"],
            zip_code=result["zip_code"],
        )
        lat, lng = address.geocode_lat_lng()

        property = Property(
            owner_id=result["owner_id"],
            category_id=result["category_id"],
            built_in_year=result["built_in_year"],
            name=result["name"],
            address_1=result["address_1"],
            address_2=result["address_2"],
            city=result["city"],
            state=result["state"],
            zip_code=result["zip_code"],
            lat=lat,
            lng=lng,
            review_summary=ReviewSummary(total=0, total_rating=0),
        )

        #  Write pending changes to db so we can get the property id for unit_prices
        db.session.add(property)
        db.session.flush()

        if result["images"]:
            for image_url in result["images"]:
                property.images.append(PropertyImage(url=image_url))
        if result["units"]:
            for unit_data in result["units"]:
                unit = PropertyUnit(
                    unit_num=unit_data["unit_num"],
                    unit_category_id=unit_data["unit_category_id"],
                    baths=unit_data["baths"],
                    price=UnitPrice(
                        property_id=property.id,
                        unit_category_id=unit_data["unit_category_id"],
                        price=unit_data["price"],
                        sq_ft=unit_data["sq_ft"],
                    ),
                    sq_ft=unit_data["sq_ft"],
                    floor_plan_img=unit_data["floor_plan_img"],
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
        if (
            property.address_1 != form.data["address1"]
            or property.address_2 != form.data["address2"]
            or property.city != form.data["city"]
            or property.state != form.data["state"]
            or property.zip_code != form.data["zipCode"]
        ):
            address = Address(
                address_1=form.data["address1"],
                address_2=form.data["address2"],
                city=form.data["city"],
                state=form.data["state"],
                zip_code=form.data["zipCode"],
            )
            lat, lng = address.geocode_lat_lng()
            property.lat = lat
            property.lng = lng

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


@properties_routes.route("/<int:property_id>/reviews")
def get_property_reviews(property_id):
    property = Property.query.options(
        joinedload(Property.reviews),
    ).get(property_id)
    if not property:
        return {"error": "Not Found"}, 404

    return {
        "id": property.id,
        "reviews": [review.to_dict() for review in property.reviews],
    }


@properties_routes.route("/<int:property_id>/reviews", methods=["POST"])
@login_required
def add_property_review(property_id):
    form = ReviewForm()
    form.csrf_token.data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        property = Property.query.get(property_id)

        if not property:
            return {"error": "Not Found"}, 404

        review = Review(
            user_id=current_user.id,
            rating=form.data["rating"],
            comment=form.data["comment"],
        )
        property.reviews.append(review)
        property.review_summary.total += 1
        property.review_summary.total_rating += review.rating

        db.session.add(property)
        db.session.commit()
        return {
            "reviewSummary": property.review_summary.to_dict(),
            "review": review.to_dict(),
        }
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
                price=int(form.data["price"] * 100),
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
