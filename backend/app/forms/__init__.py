def pick_patched_data(json_data_value, default=None):
    if json_data_value == "":
        return None
    if json_data_value != None:
        return json_data_value
    return default
