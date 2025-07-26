import pytest
from hackathon.db import get_db


def test_index(client, app):
    response = client.get("/scores/?game=minesweeper&difficulty=0")
    assert response.status_code == 200
    response = client.get("/scores/")
    assert b"invalid" in response.data


def test_new_score(client, app):
    response = client.post(
        "/scores/new",
        data = {
            "game": "minesweeper",
            "difficulty": 0,
            "name": "DDD",
            "score": 400,
        }
    )
    assert response.status_code == 200
    assert response.json == {'saved': True}
    with app.app_context():
        scores = get_db().execute("SELECT * FROM scores").fetchall()
    assert len(scores) == 10


def test_new_score_full_board(client, app):
    another_easy_score = ["minesweeper", 0, "AAA", 100]
    more_easy_scores = []
    for i in range(17):
        more_easy_scores.append(another_easy_score)
    with app.app_context():
        db = get_db()
        db.executemany(
            "INSERT INTO scores (game, difficulty, name, score)"
            " VALUES (?, ?, ?, ?)",
            (more_easy_scores)
        )
        db.commit()
        easy_scores = db.execute("SELECT * FROM scores WHERE difficulty = 0").fetchall()
        assert len(easy_scores) == 20
    response = client.post(
        "/scores/new",
        data = {
            "game": "minesweeper",
            "difficulty": 0,
            "name": "DDD",
            "score": 1000,
        }
    )
    assert response.status_code == 200
    assert response.json == {'saved': False}
    response = client.post(
        "/scores/new",
        data = {
            "game": "minesweeper",
            "difficulty": 0,
            "name": "DDD",
            "score": 1,
        }
    )
    assert response.status_code == 200
    assert response.json == {'saved': True}
