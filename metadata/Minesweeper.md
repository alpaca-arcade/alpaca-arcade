# Minesweeper

## Features

- **Classic & Custom Gameplay**:  
  Play easy, medium, hard, or set your own grid size and bomb count.

- **Live Global Leaderboards**:  
  High scores by difficulty, stored server-side (no local cheating possible!).

- **hCaptcha-Protected Submissions**:  
  Anti-bot/anti-cheat: getting on the leaderboard actually means something!

- **Retro Neon Aesthetics**:  
  Custom CSS and pixel fonts for that classic puzzler vibe.

- **Built With Modern Python & JS**:  
  Flask backend, vanilla JS frontend and sweet component modularity.

## High Score Integrity

- Only 3-letter names, max 20 high scores per mode. Custom mode has no leaderboard
- Score verification and leaderboard submission require completing a captcha.

## Controls

- Left-click: Reveal a cell
- Right-click (or long-press, mobile): Flag a mine
- Win by revealing all safe cells. Hit a mine and... game over!