import os
import sqlite3
import click
from flask import current_app, g
import random


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(
            current_app.config["DATABASE"],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row
    return g.db


def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    db = get_db()
    with current_app.open_resource("schema.sql") as f:
        db.executescript(f.read().decode("utf-8"))

    minesweeper_scores = current_app.config["MINESWEEPER_SCORES"]
    if minesweeper_scores is not None:
        db.executemany("INSERT INTO scores (game, difficulty, name, score) VALUES ('minesweeper', ?, ?, ?)", (minesweeper_scores))
        db.commit()


@click.command("init-db")
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo("Initialized the database.")


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)

