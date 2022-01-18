import os
from flask import Flask, redirect, request
from flask_cors import CORS

from app.api_routes import api_routes
from app.config import Config
from app.models import db

app = Flask(__name__)
app.config.from_object(Config)

app.register_blueprint(api_routes)

db.init_app(app)

CORS(app)

# Ensure that requests are made over HTTPS
@app.before_request
def https_redirect():
    if os.environ.get("FLASK_ENV") == "production":
        if request.headers.get("X-Forwarded-Proto") == "http":
            url = request.url.replace("http://", "https://", 1)
            code = 301
            return redirect(url, code=code)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def react_root(path):
    if path == "favicon.ico":
        return app.send_static_file("favicon.ico")
    return app.send_static_file("index.html")
