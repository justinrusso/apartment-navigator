import os
from flask import Flask, redirect, request
from flask_cors import CORS
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_wtf.csrf import generate_csrf

from app.api_routes import api_routes
from app.config import Config
from app.models import db, User
from app.seeds import seed_commands

app = Flask(__name__)
app.config.from_object(Config)

"""
Disable strict slashes so urls can end without a `/` and still work
"""
app.url_map.strict_slashes = False

app.cli.add_command(seed_commands)

login = LoginManager(app)


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


@login.unauthorized_handler
def unauthorized():
    return {"error": "Unauthorized"}, 401


app.register_blueprint(api_routes)

db.init_app(app)
Migrate(app, db)

CORS(app)

# Ensure that requests are made over HTTPS
@app.before_request
def https_redirect():
    if os.environ.get("FLASK_ENV") == "production":
        if request.headers.get("X-Forwarded-Proto") == "http":
            url = request.url.replace("http://", "https://", 1)
            code = 301
            return redirect(url, code=code)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        "csrf_token",
        generate_csrf(),
        secure=True if os.environ.get("FLASK_ENV") == "production" else False,
        samesite="Strict" if os.environ.get("FLASK_ENV") == "production" else None,
        httponly=True,
    )
    return response


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def react_root(path):
    if path == "favicon.ico":
        return app.send_static_file("favicon.ico")
    return app.send_static_file("index.html")
