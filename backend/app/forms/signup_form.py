import re
from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError, Length, Regexp
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


def password_valid(form, field):
    password = field.data

    valid_length = len(password) >= 8
    has_lowercase = 1 if re.search("[a-z]", password) else 0
    has_uppercase = 1 if re.search("[A-Z]", password) else 0
    has_numbers = 1 if re.search("[0-9]", password) else 0
    has_symbol = 1 if re.search("\w", password) else 0

    if (
        not valid_length
        or (has_lowercase + has_uppercase + has_numbers + has_symbol) < 3
    ):
        raise ValidationError(
            "Password must contain at least 8 characters and have at least 3 of the 4 requirements: 1 lowercase, 1 uppercase, 1 number, and 1 symbol"
        )


class SignupForm(FlaskForm):
    username = StringField(
        validators=[
            DataRequired(),
            Length(max=40, message="Username must not exceed 40 characters"),
            Regexp(
                "^\w+$",
                message="Username must contain only letters, numbers, or underscores",
            ),
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
    password = StringField(
        "password",
        validators=[
            DataRequired(),
            password_valid,
        ],
    )
