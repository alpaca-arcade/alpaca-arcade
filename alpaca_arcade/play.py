from flask import Blueprint, request, render_template
from .scores import get_credential, creds_found

bp = Blueprint("play", __name__)

@bp.route("/")
def index():
    game = request.args.get("game", "")
    error = None
    if game not in ["minesweeper", "breakout"]:
        error = "invalid or missing game"
    if error:
        return error, 400

    hcaptcha_sitekey = get_credential("HCAPTCHA_SITEKEY")
    context = {
        'hcaptcha_sitekey': hcaptcha_sitekey,
        'hcaptcha_credentials_found': creds_found
    }

    return render_template(f"play/{game}.html", **context)
