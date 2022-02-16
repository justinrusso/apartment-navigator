def validation_errors_to_dict(validation_errors):
    # TODO: Deprecated
    return validation_errors


def pick_patched_data(json_data_value, default=None):
    if json_data_value == "":
        return None
    if json_data_value != None:
        return json_data_value
    return default
