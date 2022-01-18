from flask import Flask
from flask_cors import CORS

from app.api_routes import api_routes

app = Flask(__name__)

app.register_blueprint(api_routes)

CORS(app)
