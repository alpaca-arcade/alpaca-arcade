from flask import Blueprint, request
from incontext.db import get_db


bp = Blueprint("scores", __name__, url_prefix="/scores")


@bp.route("/", methods=("GET",))
def index():
    scores = get_scores()
    return scores


@bp.route("/new", methods=("POST",))
def new():
    game = request.form["game"]
    name = request.form["name"]
    score = request.form["score"]
    save_score(game, name, score)
    return "ok"


def get_scores():
    scores = get_db.execute("SELECT * FROM scores").fetchall()
    return scores


def save_score(game, name, score):
    db = get_db()
    db.execute(
        "INSERT INTO scores (game, name, score)"
        " VALUES (?, ?, ?)",
        (game, name, score)
    )
    db.commit()
