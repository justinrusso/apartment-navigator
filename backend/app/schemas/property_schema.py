from datetime import date
from marshmallow import fields, pre_load, validate

from app.models import PropertyCategory
from .unit_schema import MultiUnitSchema, SingleUnitSchema
from .utils import BaseSchema


class PropertyBaseSchema(BaseSchema):
    owner_id = fields.Integer(required=True, allow_none=False)
    category_id = fields.Integer(allow_none=False)
    built_in_year = fields.Integer(
        required=True,
        allow_none=False,
        validate=validate.Range(min=1800, max=date.today().year + 20),
    )
    name = fields.String(allow_none=True)
    address_1 = fields.String(required=True, allow_none=False)
    address_2 = fields.String(allow_none=True)
    city = fields.String(required=True, allow_none=False)
    state = fields.String(required=True, allow_none=False)
    zip_code = fields.String(required=True, allow_none=False)
    images = fields.List(fields.Url(allow_none=False))

    @pre_load
    def populate_validators(self, data, **kwargs):
        self.declared_fields["category_id"].validators.append(
            validate.OneOf([c.id for c in PropertyCategory.query.all()])
        )
        return data


class MultiPropertySchema(PropertyBaseSchema):
    units = fields.List(fields.Nested(MultiUnitSchema()))


class SinglePropertySchema(PropertyBaseSchema):
    units = fields.List(fields.Nested(SingleUnitSchema()))
