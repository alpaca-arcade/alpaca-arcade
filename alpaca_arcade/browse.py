from flask import (
    Blueprint, render_template
)

bp = Blueprint('browse', __name__)

@bp.route('/')
def index():
    return render_template('browse/index.html')
