from flask import Flask

from app.api_routes import api_routes

app = Flask(__name__)

app.register_blueprint(api_routes)
