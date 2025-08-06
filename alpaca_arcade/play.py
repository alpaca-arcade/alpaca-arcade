from flask import Blueprint, render_template
from .scores import get_credential


bp = Blueprint("play", __name__, url_prefix="/play")


@bp.route("/")
def index():
    hcaptcha_sitekey = get_credential("HCAPTCHA_SITEKEY")
    return render_template("play/index.html", hcaptcha_sitekey=hcaptcha_sitekey)
