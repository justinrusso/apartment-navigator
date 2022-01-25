from flask_wtf import FlaskForm
from wtforms import IntegerField, SelectField, StringField
from wtforms.validators import DataRequired

from app.forms import ListField


class PropertyForm(FlaskForm):
    ownerId = IntegerField(validators=[DataRequired()])
    categoryId = SelectField(coerce=int, validators=[DataRequired()])
    builtInYear = IntegerField(validators=[DataRequired()])
    name = StringField(validators=[])
    address1 = StringField(validators=[DataRequired()])
    address2 = StringField(validators=[])
    city = StringField(validators=[DataRequired()])
    state = StringField(validators=[DataRequired()])
    zipCode = StringField(validators=[DataRequired()])
    images = ListField()
    units = ListField()
