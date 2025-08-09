from flask import Blueprint, render_template
from .scores import get_scores, creds_found


bp = Blueprint("home", __name__)


@bp.route("/")
def index():
    minesweeper_scores_easy = get_scores("minesweeper", 0)
    minesweeper_scores_medium = get_scores("minesweeper", 1)
    minesweeper_scores_hard = get_scores("minesweeper", 2)
    return render_template(
        "home/index.html",
        minesweeper_scores_easy=minesweeper_scores_easy,
        minesweeper_scores_medium=minesweeper_scores_medium,
        minesweeper_scores_hard=minesweeper_scores_hard,
        hcaptcha_credentials_found=creds_found

    )
