from flask import Blueprint, request, render_template
from .scores import get_scores, creds_found


bp = Blueprint("overview", __name__)


@bp.route("/")
def index():
    game = request.args.get("game", "")
    error = None
    if game not in ["minesweeper", "breakout"]:
        error = "invalid or missing game"
    if error:
        return error, 400

    context = {}
    if game == "minesweeper":
        context = {
        'minesweeper_scores_easy': get_scores("minesweeper", 0),
        'minesweeper_scores_medium': get_scores("minesweeper", 1),
        'minesweeper_scores_hard': get_scores("minesweeper", 2),
        'hcaptcha_credentials_found': creds_found
        }

    return render_template(f"overview/{game}.html", **context)
