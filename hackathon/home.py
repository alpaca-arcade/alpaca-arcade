from flask import Blueprint, render_template
from .scores import get_scores


bp = Blueprint("home", __name__)


@bp.route("/")
def index():
    scores = get_scores()
    return render_template("home/index.html", scores=scores)
