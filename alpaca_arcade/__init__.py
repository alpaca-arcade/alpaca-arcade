import os
from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix
from instance.config import APPLICATION_ROOT


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True, static_url_path=APPLICATION_ROOT+"/static")
    app.wsgi_app = ProxyFix(
        app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
    )
    app.config.from_mapping(
        SECRET_KEY="dev",
        DATABASE=os.path.join(app.instance_path, "alpaca_arcade.sqlite"),
    )
    if test_config is None:
        app.config.from_pyfile("config.py", silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    application_root = app.config.get('APPLICATION_ROOT', '')

    from . import db
    db.init_app(app)

    from . import browse
    app.register_blueprint(browse.bp, url_prefix=application_root)
    app.add_url_rule(application_root, endpoint="index")

    from . import overview
    app.register_blueprint(overview.bp, url_prefix=application_root+"/overview")

    from . import play
    app.register_blueprint(play.bp, url_prefix=application_root+"/play")

    from .import scores
    app.register_blueprint(scores.bp, url_prefix=application_root+"/scores")


    return app

