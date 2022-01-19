from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import User


def email_exists(form, field):
    email = field.data
    user = User.query.filter(User.email.ilike(email)).first()
    if user:
        raise ValidationError("Email address is already in use")


def username_exists(form, field):
    username = field.data
    user = User.query.filter(User.username.ilike(username)).first()
    if user:
        raise ValidationError("Username is already in use")


class RegisterForm(FlaskForm):
    username = StringField(
        validators=[
            DataRequired(),
            Length(max=40, message="Username must not exceed 40 characters"),
            username_exists,
        ],
    )
    email = StringField(
        validators=[
            DataRequired(),
            Email("Provide a valid email address"),
            Length(max=255, message="Email address must not exceed 255 characters"),
            email_exists,
        ],
    )
    firstName = StringField(
        validators=[
            DataRequired(),
            Length(max=50, message="First name must not exceed 50 characters"),
        ],
    )
    lastName = StringField(
        validators=[
            DataRequired(),
            Length(max=50, message="Last name must not exceed 50 characters"),
        ],
    )
    company = StringField(
        validators=[
            Length(max=100, message="Company name must not exceed 100 characters"),
        ],
    )
    password = StringField("password", validators=[DataRequired()])
