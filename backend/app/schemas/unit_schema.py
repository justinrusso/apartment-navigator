from marshmallow import fields, post_load, pre_load, validate

from app.models import UnitCategory
from .utils import BaseSchema


class SingleUnitSchema(BaseSchema):
    unit_num = fields.String(allow_none=True)
    unit_category_id = fields.Integer(required=True, allow_none=False)
    baths = fields.Integer(
        required=True,
        allow_none=False,
        validate=validate.OneOf([i for i in range(50, 651, 50)]),
    )
    price = fields.Float(required=True, allow_none=False)
    sq_ft = fields.Integer(required=True, allow_none=False)
    floor_plan_img = fields.String(validate=validate.URL(), allow_none=True)

    @pre_load
    def populate_validators(self, data, **kwargs):
        self.declared_fields["unit_category_id"].validators.append(
            validate.OneOf([c.id for c in UnitCategory.query.all()])
        )
        return data

    @post_load
    def convert_float_price(self, data, **kwargs):
        price = data["price"]
        if price:
            data["price"] = int(price * 100)
        return data


class MultiUnitSchema(SingleUnitSchema):
    unit_num = fields.String(required=True, allow_none=False)
