from marshmallow import Schema, pre_load


def camelcase(s):
    parts = iter(s.split("_"))
    return next(parts) + "".join(i.title() for i in parts)


class BaseSchema(Schema):
    def on_bind_field(self, field_name, field_obj):
        field_obj.data_key = camelcase(field_obj.data_key or field_name)

    @pre_load
    def replace_empty_strings_with_nones(self, data, **kwargs):
        for key in data.keys():
            if isinstance(data[key], str):
                data[key] = data[key] or None
        return data
