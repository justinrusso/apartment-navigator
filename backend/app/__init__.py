import os
from flask import Flask, redirect, request
from flask_cors import CORS

from app.api_routes import api_routes

app = Flask(__name__)

app.register_blueprint(api_routes)

CORS(app)

# Ensure that requests are made over HTTPS
@app.before_request
def https_redirect():
    if os.environ.get("FLASK_ENV") == "production":
        if request.headers.get("X-Forwarded-Proto") == "http":
            url = request.url.replace("http://", "https://", 1)
            code = 301
            return redirect(url, code=code)
