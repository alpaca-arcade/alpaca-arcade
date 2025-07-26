from flask import Blueprint, render_template
from .scores import get_scores


bp = Blueprint("home", __name__)


@bp.route("/")
def index():
    minesweeper_scores = get_scores("minesweeper")
    return render_template("home/index.html", minesweeper_scores=minesweeper_scores)
