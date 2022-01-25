from flask_wtf import FlaskForm


class CSRFForm(FlaskForm):
    """
    An empty form used to just validate the csrf token
    """

    def __init__(self, **kwargs):
        FlaskForm.__init__(self, formdata=dict())
