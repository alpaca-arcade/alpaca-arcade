import pytest


def test_index(client):
    response = client.get("/play/")
    assert response.status_code == 200
