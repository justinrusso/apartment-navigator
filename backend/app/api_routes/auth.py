from flask import Blueprint, request
from flask_login import login_user
from sqlalchemy import or_

from app.forms import validation_errors_to_dict
from app.forms.login_form import LoginForm
from app.forms.signup_form import SignupForm
from app.models import db, User


auth_routes = Blueprint("auth", __name__, url_prefix="/auth")


@auth_routes.route("/login", methods=["POST"])
def login():
    form = LoginForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        credentials = form.data["credentials"]
        user = User.query.filter(
            or_(User.email.ilike(credentials), User.username.ilike(credentials))
        ).first()
        login_user(user)
        return user.to_dict()
    return {"errors": validation_errors_to_dict(form.errors)}, 401


@auth_routes.route("/login/demo")
def login_demo_user():
    user = User.query.filter(User.email == "demo@aa.io").first()
    login_user(user)
    return user.to_dict()


@auth_routes.route("/signup", methods=["POST"])
def signup():
    form = SignupForm()
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
