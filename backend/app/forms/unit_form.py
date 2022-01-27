from flask_wtf import FlaskForm
from wtforms import FloatField, IntegerField, SelectField, StringField
from wtforms.validators import DataRequired, Regexp


class MultiUnitForm(FlaskForm):
    unitNum = StringField(validators=[DataRequired()])
    unitCategoryId = SelectField(coerce=int, validators=[DataRequired()])
    baths = SelectField(
        choices=[(i, i) for i in range(50, 651, 50)],
        coerce=int,
        validators=[
            DataRequired(),
        ],
    )
    price = FloatField(validators=[DataRequired(), Regexp("^\d*(\.\d{0,2})?$")])
    sqFt = IntegerField(validators=[DataRequired()])
    floorPlanImg = StringField(validators=[])


class SingleUnitForm(FlaskForm):
    unitCategoryId = SelectField(coerce=int, validators=[DataRequired()])
    baths = SelectField(
        choices=[(i, i) for i in range(50, 651, 50)],
        coerce=int,
        validators=[
            DataRequired(),
        ],
    )
    price = FloatField(validators=[DataRequired(), Regexp("^\d*(\.\d{0,2})?$")])
    sqFt = IntegerField(validators=[DataRequired()])
    floorPlanImg = StringField(validators=[])
