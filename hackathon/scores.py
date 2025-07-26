from flask import Blueprint, request
from hackathon.db import get_db


bp = Blueprint("scores", __name__, url_prefix="/scores")


@bp.route("/", methods=("GET",))
def index():
    game = request.args.get("game", "")
    error = None
    if game not in ["minesweeper"]:
        error = "invalid or missing game"
        return error, 400
    scores = get_scores(game)
    return scores


@bp.route("/new", methods=("POST",))
def new():
    game = request.form["game"]
    name = request.form["name"]
    score = request.form["score"]
    save_score(game, name, score)
    return "ok"


def get_scores(game):
    scores = get_db().execute("SELECT id, name, score FROM scores WHERE game = ?", (game,)).fetchall()
    scores = [
        {
            "name": score["name"],
            "score": score["score"],
        }
        for score in scores
    ]
    return scores


def save_score(game, name, score):
    db = get_db()
    db.execute(
        "INSERT INTO scores (game, name, score)"
        " VALUES (?, ?, ?)",
        (game, name, score)
    )
    db.commit()
