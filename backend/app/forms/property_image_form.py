from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired


class PropertyImageForm(FlaskForm):
    imageUrl = StringField(validators=[DataRequired()])
