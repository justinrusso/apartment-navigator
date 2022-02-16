from datetime import date
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import (
    FieldList,
    FormField,
    IntegerField,
    SelectField,
    StringField,
)
from wtforms.validators import DataRequired, NumberRange

from app.models import PropertyCategory

from .base_form import BaseForm
from .property_image_form import ALLOWED_IMAGE_EXTENSIONS
from .unit_form import MultiUnitForm, SingleUnitForm


class PropertyFormBase(BaseForm):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.categoryId.choices = [(c.id, c.name) for c in PropertyCategory.query.all()]

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
    images = FieldList(
        FileField(
            validators=[
                FileRequired(),
                FileAllowed(ALLOWED_IMAGE_EXTENSIONS, "Unrecognized image format."),
            ]
        )
    )


class MultiUnitPropertyForm(PropertyFormBase):
    units = FieldList(FormField(MultiUnitForm))


class SingleUnitPropertyForm(PropertyFormBase):
    units = FieldList(FormField(SingleUnitForm))
