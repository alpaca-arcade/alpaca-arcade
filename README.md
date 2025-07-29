# Bootsweeper

Play Now at [our hosted version](https://jkgarber.com/hackathon)!

> _Minesweeper meets neon style._  
> A retro-inspired, fully featured minesweeper web app with a global leaderboard, custom difficulty, and cheater-proof high scores!  
> _Built in 72 hours for the [Boot.dev](https://boot.dev/) 2025 Hackathon._  

![Screenshot](https://jkgarber.com/hackathon/static/screenshot.png)

## 🚀 Features

- **Classic & Custom Gameplay**:  
  Play easy, medium, hard, or set your own grid size and bomb count.

- **Live Global Leaderboards**:  
  High scores by difficulty, stored server-side (no local cheating possible!).

- **hCaptcha-Protected Submissions**:  
  Anti-bot/anti-cheat: getting on the leaderboard actually means something!

- **Retro Neon Aesthetics**:  
  Custom CSS and pixel fonts for that classic puzzler vibe.

- **Built With Modern Python & JS**:  
  Flask backend, vanilla JS frontend, and sweet component modularity.

## 🏁 Quick Start (for a local server)

It'll take more than 5 minutes so head on over to [Bootsweeper](https://jkgarber.com/hackathon) if you just want to play!

Why does it take so long? Setup requires a slight bit of manual config and an [hCaptcha](https://www.hcaptcha.com/) secret.

### 1. Clone & Install

```bash
git clone https://github.com/joshkgarber/bootdotdev_hackathon_2025.git
cd bootdotdev_hackathon_2025
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
```

### 2. Set Up

1. **Instance config:**  
   Edit `instance/config.py` with:
   ```python
   APPLICATION_ROOT = "/hackathon"
   ```
   Before you initialize the database, if you would like to insert dummy data for the leaderboard, edit `instance/config.py` with:
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
   (You can skip this part if you don't save your high scores.)
   
   Make your hCaptcha secret key an environment variable called `HCAPTCHA_SECRET`.

   Make your hCaptcha site key an environment variable called `HCAPTCHA_SITEKEY`.

3. **Initialize the database:**
   (You can skip this if you don't save your high scores.)
   ```bash
   flask --app hackathon init-db
   ```

### 3. Run the App

```bash
flask --app hackathon run
```
Visit [http://localhost:5000](http://localhost:5000) and start sweeping!

#### (Optional) Run via Gunicorn
Production-style:
```bash
gunicorn -w 4 "hackathon:create_app()"
```

## 🏆 High Score Integrity

- Only 3-letter names, max 20 high scores per mode.
- Score verification and leaderboard submission require completing a captcha.

## 🕹️ Controls

- Left-click: Reveal a cell
- Right-click (or long-press, mobile): Flag a mine
- Win by revealing all safe cells. Hit a mine and... game over!

## ⚡ Technologies

- **Backend:** Python, Flask, SQLite
- **Frontend:** Vanilla JavaScript (custom Web Components), HTML5, CSS3
- **Other:** hCaptcha (for leaderboard)

## 👥 Authors

- @joshkgarber
- @BrightDN
- @lbruce999

Feel free to tag us or [Boot.dev](https://twitter.com/bootdotdev) if you enjoyed the game!

## 🎉 For the Boot.dev Hackathon

We built this in a wild weekend sprint—feedback and stars appreciated!  
