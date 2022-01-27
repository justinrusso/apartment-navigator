from flask_wtf import FlaskForm
from wtforms import SelectField, StringField
from wtforms.validators import DataRequired


class MultiUnitForm(FlaskForm):
    unitNum = StringField(validators=[DataRequired()])
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
