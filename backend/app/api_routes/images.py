from flask import Blueprint
from flask_login import current_user, login_required

from app.apis import s3
from app.forms.csrf_form import CSRFForm
from app.models import PropertyImage, db


images_routes = Blueprint("images", __name__, url_prefix="/images")


@images_routes.route("/<int:image_id>", methods=["DELETE"])
@login_required
def delete_image(image_id):
    form = CSRFForm()

    if form.validate_on_submit():
        image = PropertyImage.query.get(image_id)

        if not image:
            return {"error": "Not Found"}, 404
        if image.property.owner.id != current_user.id:
            return {"error": "Forbidden"}, 403

        if image.url.startswith(s3.BASE_PATH):
            s3.delete_file(image.url.replace(s3.BASE_PATH, ""))

        db.session.delete(image)
        db.session.commit()
        return {"id": image_id}
    return {"errors": form.errors}, 400
