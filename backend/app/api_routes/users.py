from flask import Blueprint
from flask_login import current_user, login_required

from app.models import User


users_routes = Blueprint("users", __name__, url_prefix="/users")


@users_routes.route("/properties")
@login_required
def user_owned_properties():
    return {"properties": [property.to_dict() for property in current_user.properties]}
