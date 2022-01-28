from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField
from wtforms.validators import DataRequired


class ReviewForm(FlaskForm):
    rating = IntegerField(validators=[DataRequired()])
    comment = StringField(validators=[DataRequired()])
