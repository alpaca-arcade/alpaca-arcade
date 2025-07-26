document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('minesweeper-grid');
  const playButton = document.getElementById("play-button");
  const difficultySelect = document.getElementById('difficulty');
  let rows, cols, mines, remainingBombs;
  let cells = [];
  let minePositions = new Set();
  let flags = new Set();
  let revealed = new Set();
  let timerInterval;
  let startTime;
  let isGameRunning = false;


  function initGame() {

    if (!isGameRunning) isGameRunning = true;
    grid.innerHTML = '';
    cells = [];
    minePositions.clear();
    flags.clear();
    revealed.clear();

    switch (difficultySelect.value) {
      case 'easy':
        rows = 8;
        cols = 8;
        mines = 10;
        break;
      case 'medium':
        rows = 16;
        cols = 16;
        mines = 40;
        break;
      case 'hard':
        rows = 24;
        cols = 24;
        mines = 99;
        break;
      case 'custom':
        rows = parseInt(document.querySelector("#rows-input").value);
        cols = parseInt(document.querySelector("#cols-input").value);
        mines = parseInt(document.querySelector("#mines-input").value);
        break;
      default:
        alert('Something went wrong, reverting to default difficulty!\nPlease contact a dev to look into this.');
        rows = 16;
        cols = 16;
        mines = 40;
        break;
    }

remainingBombs = mines;
adjustBombCounter(0);

grid.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
grid.style.gridTemplateRows = `repeat(${rows}, 40px)`;

    for (let r = 0; r < rows; r++) {
      cells[r] = [];
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.addEventListener('click', () => revealCell(r, c));
        cell.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          toggleFlag(r, c);
        });
        grid.appendChild(cell);
        cells[r][c] = cell;
      }
    }

    placeMines();
    document.getElementById("elapsed-time").textContent = "00:00:00";
    startTimer();
  }

  function placeMines() {
    while (minePositions.size < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      const pos = r + ',' + c;
      if (!minePositions.has(pos)) {
        minePositions.add(pos);
      }
    }
  }

  function countAdjacentMines(r, c) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          if (minePositions.has(nr + ',' + nc)) {
            count++;
          }
        }
      }
    }
    return count;
  }

  function revealCell(r, c) {
    if (!isGameRunning) return;
    const pos = r + ',' + c;
    if (flags.has(pos) || revealed.has(pos)) return;
    const cell = cells[r][c];
    revealed.add(pos);
    cell.classList.add('revealed');

    if (minePositions.has(pos)) {
      cell.textContent = '💣';
      alert('Game Over!');
      revealAllMines();
      stopGame();
      return;
    }

    const count = countAdjacentMines(r, c);
    if (count > 0) {
      cell.textContent = count;
    } else {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            if (!revealed.has(nr + ',' + nc)) {
              revealCell(nr, nc);
            }
          }
        }
      }
    }

    checkWin();
  }

  function toggleFlag(r, c) {
    if (!isGameRunning) return;
    const pos = r + ',' + c;
    if (revealed.has(pos)) return;
    const cell = cells[r][c];
    if (flags.has(pos)) {
      // Remove flag
      flags.delete(pos);
      cell.textContent = '';
      cell.classList.remove('flagged');
      adjustBombCounter(1);
    } else {
      // Add flag
      if (remainingBombs == 0) return;
      flags.add(pos);
      cell.textContent = '🚩';
      cell.classList.add('flagged');
      adjustBombCounter(-1);
    }
  }

  function revealAllMines() {
    minePositions.forEach(pos => {
      const [r, c] = pos.split(',').map(Number);
      const cell = cells[r][c];
      cell.textContent = '💣';
      cell.classList.add('mine');
    });
  }

  function checkWin() {
    if (revealed.size === rows * cols - mines) {
      alert('You Win!');
      revealAllMines();
      stopGame();
    }
  }

  playButton.addEventListener('click', initGame)
  initGame();
  
  function formatTime(seconds) {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  }
  
  function startTimer() {
    if (timerInterval) {
      clearInterval(timerInterval); // reset if already running
    }
    startTime = Date.now();
    timerInterval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      document.getElementById("elapsed-time").textContent = formatTime(elapsedSeconds);
    }, 1000);
  }
  
  function stopTimer() {
    clearInterval(timerInterval);
  }

  function adjustBombCounter(value){
    remainingBombs += value;
    document.getElementById("bomb-count").innerHTML = remainingBombs
  }

  function stopGame() {
    stopTimer();
    isGameRunning = false;
  }
  
});