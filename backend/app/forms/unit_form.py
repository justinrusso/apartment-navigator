from flask_wtf import FlaskForm
from wtforms import IntegerField, SelectField, StringField
from wtforms.validators import DataRequired


class MultiUnitForm(FlaskForm):
    unitNum = IntegerField(validators=[DataRequired()])
    unitCategoryId = SelectField(coerce=int, validators=[DataRequired()])
    baths = StringField(validators=[DataRequired()])
    price = StringField(validators=[DataRequired()])
    sqFt = StringField(validators=[DataRequired()])
    floorPlanImg = StringField(validators=[])


class SingleUnitForm(FlaskForm):
    unitCategoryId = SelectField(coerce=int, validators=[DataRequired()])
    baths = StringField(validators=[DataRequired()])
    price = StringField(validators=[DataRequired()])
    sqFt = StringField(validators=[DataRequired()])
    floorPlanImg = StringField(validators=[])
