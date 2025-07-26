# Boot.dev Hackathon 2025

## Project structure

```
.
├── hackathon
│   ├── __init__.py
│   ├── db.py
│   ├── home.py
│   ├── play.py
│   ├── schema.sql
│   ├── scores.py
│   ├── static
│   │   └── styles.css
│   └── templates
│       ├── base.html
│       ├── home
│       │   └── index.html
│       └── play
│           └── index.html
├── instance
│   └── hackathon.sqlite
├── pyproject.toml
├── README.md
└── tests
    ├── conftest.py
    ├── test_db.py
    ├── test_factory.py
    ├── test_home.py
    ├── test_play.py
    └── test_scores.py
```

## Local Development Server

1. Clone the repository
2. `cd` into the repository
3. Create a Python virtual environment: `python3 -m venv .venv`
4. Source the environment: `source .venv/bin/activate`
5. Install the package in editable mode: `pip install -e .`
6. (Optional) Initialize the database `flask --app hackathon init-db`. Note this will wipe the database contents.
7. Start the server in debug mode: `flask --app hackathon run --debug`.

The app is now running locally and available at [localhost](http://127.0.0.1:5000).
