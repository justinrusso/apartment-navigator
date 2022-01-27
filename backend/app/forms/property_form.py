from datetime import date
from flask_wtf import FlaskForm
from wtforms import IntegerField, SelectField, StringField
from wtforms.validators import DataRequired, NumberRange

from app.forms import ListField


class PropertyForm(FlaskForm):
    ownerId = IntegerField(validators=[DataRequired()])
    categoryId = SelectField(coerce=int, validators=[DataRequired()])
    builtInYear = IntegerField(
        validators=[DataRequired(), NumberRange(min=1800, max=date.today().year + 20)]
    )
    name = StringField(validators=[])
    address1 = StringField(validators=[DataRequired()])
    address2 = StringField(validators=[])
    city = StringField(validators=[DataRequired()])
    state = StringField(validators=[DataRequired()])
    zipCode = StringField(validators=[DataRequired()])
    images = ListField()
    units = ListField()
