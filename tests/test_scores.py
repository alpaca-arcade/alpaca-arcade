import pytest
from hackathon.db import get_db


def test_index(client, app):
    response = client.get("/scores/?game=minesweeper")
    assert response.status_code == 200
    response = client.get("/scores/")
    assert b"invalid" in response.data
