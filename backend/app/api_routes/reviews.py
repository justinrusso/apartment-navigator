from flask import Blueprint, request
from flask_login import current_user, login_required
from munch import DefaultMunch

from app.forms import pick_patched_data, validation_errors_to_dict
from app.forms.review_form import ReviewForm
from app.models import Review, db


reviews_routes = Blueprint("reviews", __name__, url_prefix="/reviews")


@reviews_routes.route("/<int:review_id>", methods=["PATCH"])
@login_required
def get_review(review_id):
    review = Review.query.get(review_id)

    if not review:
        return {"error": "Not Found"}, 404
    if review.user_id != current_user.id:
        return {"error": "Forbidden"}, 403

    body_data = request.get_json()

    form = ReviewForm(
        formdata=None,
        obj=DefaultMunch.fromDict(
            {
                "comment": pick_patched_data(body_data.get("comment"), review.comment),
                "rating": pick_patched_data(body_data.get("rating"), review.rating),
            }
        ),
    )
    form.csrf_token.data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        review_summary = review.property.review_summary
        review_summary.total_rating -= review.rating
        review_summary.total_rating += form.data["rating"]

        review.comment = form.data["comment"]
        review.rating = form.data["rating"]
        db.session.add(review)
        db.session.commit()
        return {
            "review": review.to_dict(),
            "reviewSummary": review.property.review_summary.to_dict(),
        }
    return {"errors": validation_errors_to_dict(form.errors)}, 400
