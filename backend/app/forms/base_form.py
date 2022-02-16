from flask import request
from flask_wtf import FlaskForm


class BaseForm(FlaskForm):
    class Meta:
        csrf = True

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.csrf_token.data = request.cookies["csrf_token"]
