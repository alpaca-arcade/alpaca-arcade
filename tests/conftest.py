import os
import tempfile
import pytest
from hackathon import create_app
from hackathon.db import get_db, init_db
from instance.config import MINESWEEPER_SCORES


#   with open(os.path.join(os.path.dirname(__file__), 'data.sql'), 'rb') as f:
#     _data_sql = f.read().decode('utf8')


@pytest.fixture
def app():
    db_fd, db_path = tempfile.mkstemp()

    app = create_app({
        'TESTING': True,
        'DATABASE': db_path,
        "MINESWEEPER_SCORES": MINESWEEPER_SCORES,
    })

    with app.app_context():
        init_db()
 #       get_db().executescript(_data_sql)

    yield app

    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def runner(app):
    return app.test_cli_runner()
