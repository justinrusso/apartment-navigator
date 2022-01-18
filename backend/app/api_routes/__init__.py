from flask import Blueprint

from .auth import auth_routes


api_routes = Blueprint("api", __name__, url_prefix="/api")

api_routes.register_blueprint(auth_routes)
