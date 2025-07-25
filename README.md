# Boot.dev Hackathon 2025

## Project structure

.
├── hackathon
│   ├── __init__.py
│   ├── db.py
│   ├── home.py
│   ├── schema.sql
│   ├── static
│   │   └── styles.css
│   └── templates
│       ├── base.html
│       └── home
│           └── index.html
├── instance
│   └── hackathon.sqlite
├── pyproject.toml
├── README.md
└── tests

## Local Development Server

1. Clone the repository
2. `cd` into the repository
3. Create a Python virtual environment: `python3 -m venv .venv`
4. Source the environment: `source .venv/bin/activate`
5. Install the package in editable mode: `pip install -e .`
6. (Optional) Initialize the database `flask --app hackathon init-db`. Note this will wipe the database contents.
7. Start the server in debug mode: `flask --app hackathon run --debug`.

The app is now running locally and available at [localhost](http://127.0.0.1:5000).
