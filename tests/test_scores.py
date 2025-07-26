import pytest


def test_index(client):
    response = client.get("/scores")
    assert response.status_code == 200
