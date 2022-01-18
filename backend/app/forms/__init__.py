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
