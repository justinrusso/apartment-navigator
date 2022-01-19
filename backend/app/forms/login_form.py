from flask_wtf import FlaskForm
from sqlalchemy import or_
from wtforms import HiddenField, StringField
from wtforms.validators import DataRequired, ValidationError

from app.models import User


def valid_credentials(form, _):
    credentials = form.data["credentials"]
    password = form.data["password"]

    if not credentials or not password:
        return

    user = User.query.filter(
        or_(User.email.ilike(credentials), User.username.ilike(credentials))
    ).first()
    if not user or not user.check_password(password):
        raise ValidationError("Invalid credentials")


class LoginForm(FlaskForm):
    credentials = StringField(validators=[DataRequired()])
    password = StringField(validators=[DataRequired()])
    invalid = HiddenField(validators=[valid_credentials])
