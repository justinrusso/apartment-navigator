from flask import Blueprint

from .auth import auth_routes
from .images import images_routes
from .properties import properties_routes
from .reviews import reviews_routes
from .units import units_routes
from .users import users_routes


api_routes = Blueprint("api", __name__, url_prefix="/api")

api_routes.register_blueprint(auth_routes)
api_routes.register_blueprint(images_routes)
api_routes.register_blueprint(properties_routes)
api_routes.register_blueprint(reviews_routes)
api_routes.register_blueprint(units_routes)
api_routes.register_blueprint(users_routes)
