from flask import Blueprint, request
from flask_login import login_user

from app.forms import validation_errors_to_dict
from app.forms.register_form import RegisterForm
from app.models import db, User


auth_routes = Blueprint("auth", __name__, url_prefix="/auth")


@auth_routes.route("/register", methods=["POST"])
def register():
    form = RegisterForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        user = User(
            username=form.data["username"],
            email=form.data["email"],
            password=form.data["password"],
            first_name=form.data["firstName"],
            last_name=form.data["lastName"],
            company=form.data["company"],
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return user.to_dict()
    return {"errors": validation_errors_to_dict(form.errors)}, 401
