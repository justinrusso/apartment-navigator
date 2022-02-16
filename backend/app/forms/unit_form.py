from wtforms import FloatField, IntegerField, SelectField, StringField
from wtforms.validators import DataRequired

from app.models import UnitCategory

from .base_form import BaseForm


class SingleUnitForm(BaseForm):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.unitCategoryId.choices = [(c.id, c.name) for c in UnitCategory.query.all()]

    unitCategoryId = SelectField(coerce=int, validators=[DataRequired()])
    baths = SelectField(
        choices=[(i, i) for i in range(50, 651, 50)],
        coerce=int,
        validators=[
            DataRequired(),
        ],
    )
    price = FloatField(validators=[DataRequired()])
    sqFt = IntegerField(validators=[DataRequired()])
    floorPlanImg = StringField(validators=[])


class MultiUnitForm(SingleUnitForm):
    unitNum = StringField(validators=[DataRequired()])
