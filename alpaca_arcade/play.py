from flask import Blueprint, render_template
from .scores import get_credential, creds_found


bp = Blueprint("play", __name__)


@bp.route("/")
def index():
    hcaptcha_sitekey = get_credential("HCAPTCHA_SITEKEY")
    context = {
        'hcaptcha_sitekey': hcaptcha_sitekey,
        'hcaptcha_credentials_found': creds_found
    }
    return render_template("play/index.html", **context)
