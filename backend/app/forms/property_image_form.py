from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed


ALLOWED_IMAGE_EXTENSIONS = [
    "apng",
    "gif",
    "jpg",
    "jpeg",
    "jfif",
    "pjpeg",
    "pjp",
    "png",
    "webp",
]


class PropertyImageForm(FlaskForm):
    image = FileField(
        validators=[
            FileRequired(),
            FileAllowed(ALLOWED_IMAGE_EXTENSIONS, "Unrecognized image format."),
        ]
    )
