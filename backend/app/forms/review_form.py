from flask_wtf import FlaskForm
from wtforms import SelectField, StringField
from wtforms.validators import DataRequired


class ReviewForm(FlaskForm):
    rating = SelectField(
        coerce=int,
        validators=[DataRequired()],
        choices=[(i, i) for i in range(1, 6)],
    )
    comment = StringField(validators=[DataRequired()])
