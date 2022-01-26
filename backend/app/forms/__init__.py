from wtforms import Field


def validation_errors_to_dict(validation_errors):
    """
    Turns the WTForms validation errors into a dict
    """
    errorMessages = dict()
    for field in validation_errors:
        errorMessages[field] = []
        for error in validation_errors[field]:
            errorMessages[field].append(f"{error}")
    return errorMessages


class ListField(Field):
    def process_formdata(self, valuelist):
        self.data = valuelist


def pick_patched_data(json_data_value, default=None):
    if json_data_value == "":
        return None
    if json_data_value != None:
        return json_data_value
    return default
