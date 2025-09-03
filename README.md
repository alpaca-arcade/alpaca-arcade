# Alpaca Arcade

![Screenshot](https://github.com/alpaca-arcade/alpaca-arcade/blob/main/alpaca_arcade/static/screenshot.png?raw=true)

## Technologies

- **Backend:** Python, Flask, SQLite
- **Frontend:** Vanilla JavaScript (custom Web Components), HTML5, CSS3
- **Other:** hCaptcha (for leaderboard)

## Authors

- [JKG](https://github.com/joshkgarber)
- [BrightDN](https://github.com/BrightDN)
- [Leanbean](https://github.com/lbruce999)

## Games

[minesweeper](https://github.com/alpaca-arcade/alpaca-arcade/tree/main/metadata/Minesweeper.md)

## Local Server Setup

### 1. Clone & Install

```bash
git clone https://github.com/alpaca-arcade/alpaca-arcade.git
cd alpaca-arcade
python3 -m venv .venv
source .venv/bin/activate
```

From within the (.venv) use:

```bash
mkdir instance
cd instance
touch config.py
printf 'APPLICATION_ROOT = "/"\n' > config.py
cd ..
pip install -e .
```

### 2. Set Up

#### Optional: Highscore config

1. If you wish to have dummydata on your local version, edit `instance/config.py` to include the array below:
   ```python
   MINESWEEPER_SCORES = [
       [0, "AAA", 100],
       [0, "BBB", 200],
       [0, "CCC", 300],
       [1, "AAA", 100],
       [1, "BBB", 200],
       [1, "CCC", 300],
       [2, "AAA", 100],
       [2, "BBB", 200],
       [2, "CCC", 300],
   ]
   ```

2. **hCaptcha environment variables**

   You need to obtain hCaptcha credentials by creating an account at https://www.hcaptcha.com/

   Once you have your credentials, create the environment variables:

   - `HCAPTCHA_SITEKEY="your_hcaptcha_sitekey"`
   - `HCAPTCHA_SECRET_KEY="your_hcaptcha_secret_key"`

   People do this in different ways. Follow your own preference or use our provided script. This offers a quick one-time solution for the current terminal session:

   ```bash
   source hcaptcha.sh <your_hcaptcha_sitekey> <your_hcaptcha_secret_key>
   ```

3. **Initialize the database:**
   The database requires sqlite3:

   ```bash
   sudo apt update
   sudo apt install sqlite3
   ```

   Run the code below:

   ```bash
   flask --app alpaca_arcade init-db
   ```

### 3. Run the App

```bash
flask --app alpaca_arcade run
```

Visit [http://localhost:5000](http://localhost:5000) and start sweeping!

#### (Optional) Run via Gunicorn

Production-style:

```bash
gunicorn -w 4 "alpaca_arcade:create_app()"
```

