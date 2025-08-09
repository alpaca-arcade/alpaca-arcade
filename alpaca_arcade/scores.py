from flask import Blueprint, request, jsonify
from alpaca_arcade.db import get_db
import requests
import os


bp = Blueprint("scores", __name__, url_prefix="/scores")
creds_found: bool = True


def get_credential(name):
    try:
        os_env_var = os.environ.get(name)
        if os_env_var is not None:
            return os_env_var
        else:
            credential_path = os.environ.get('CREDENTIALS_DIRECTORY')
            with open(f'{credential_path}/{name}') as f:
                credential = f.read().strip()
                return credential
    except:
        global creds_found
        creds_found = False
        return "dev"

HCAPTCHA_SECRET = get_credential("HCAPTCHA_SECRET")
HCAPTCHA_VERIFY_URL = "https://api.hcaptcha.com/siteverify"


@bp.route("/", methods=("GET",))
def index():
    game = request.args.get("game", "")
    difficulty = request.args.get("difficulty", "")
    error = None
    if game not in ["minesweeper"]:
        error = "invalid or missing game"
    if difficulty not in ["0", "1", "2"]:
        error = "invalid or missing difficulty"
    if error:
        return error, 400
    scores = get_scores(game, int(difficulty))
    return jsonify(scores)


@bp.route("/new", methods=("POST",))
def new():
    game = request.json["game"]
    difficulty = request.json["difficulty"]
    name = request.json["name"]
    score = request.json["score"]
    error = None

    if game not in ["minesweeper"]:
        error = "invalid or missing game"
    if difficulty not in [0, 1, 2]:
        error = "invalid or missing difficulty"
    if len(name) > 3 or not name.isalpha():
        error = "invalid name"
    name = name.upper()
    if type(score) != int and not score.isdigit():
        error = "invalid score"

    hc_token = request.json["h-captcha-response"]

    if hc_token is None:
        error = "Captcha token missing"

    if error is None:
        data = {
            "secret": HCAPTCHA_SECRET,
            "response":hc_token,
			"remoteip": request.remote_addr,
        }

        try:
            response = requests.post(url=HCAPTCHA_VERIFY_URL, data=data)
            result = response.json()

            if not result.get("success"):
                error = f"Captcha failed: {result.get('error-codes', ['unknown error'])}"

            if error is None:
                score = int(score)
                new_score = dict(game=game, difficulty=difficulty, name=name, score=score)
                score_saved = save_score(new_score)
                if score_saved:
                    return jsonify({"saved": True})
                return jsonify({"saved": False}),
            return jsonify({'success': False, 'message': error}), 403
        except Exception as e:
            error = f"Verification error: {str(e)}"
    return jsonify({'success': False, 'message': error}), 400


def get_scores(game, difficulty):
    scores = get_db().execute(
        "SELECT id, name, score FROM scores WHERE game = ? AND difficulty = ?",
        (game, difficulty,)
    ).fetchall()
    scores = [
        {
            "name": score["name"],
            "time": score["score"],
        }
        for score in scores
    ]
    return scores


def save_score(new_score):
    db = get_db()
    high_scores = db.execute(
        "SELECT id, score FROM scores"
        " WHERE game = ?"
        " AND difficulty = ?"
        " ORDER BY score DESC",
        (new_score["game"], new_score["difficulty"],)
    ).fetchall()
    if len(high_scores) < 20:
        new_high_score(new_score)
        return True
    low_score = high_scores[0]
    if new_score["score"] < low_score["score"]:
        new_high_score(new_score, low_score)
        return True
    return False


def new_high_score(new_score, old_score=None):
    db = get_db()
    if old_score:
        db.execute("DELETE FROM scores WHERE id = ?", (old_score["id"],))
    db.execute(
        "INSERT INTO scores (game, difficulty, name, score)"
        " VALUES (?, ?, ?, ?)",
        (new_score["game"], new_score["difficulty"], new_score["name"], new_score["score"],)
    )
    db.commit()


