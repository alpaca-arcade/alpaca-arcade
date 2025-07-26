document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('minesweeper-grid');
  const difficultySelect = document.getElementById('difficulty');
  let rows, cols, mines;
  let cells = [];
  let minePositions = new Set();
  let flags = new Set();
  let revealed = new Set();
  let timerInterval;
  let startTime;


  function initGame() {
    grid.innerHTML = '';
    cells = [];
    minePositions.clear();
    flags.clear();
    revealed.clear();

    if (difficultySelect.value === 'easy') {
  rows = 8;
  cols = 8;
  mines = 10;
} else if (difficultySelect.value === 'medium') {
  rows = 16;
  cols = 16;
  mines = 40;
} else if (difficultySelect.value === 'hard') {
  rows = 24;
  cols = 24;
  mines = 99;
}

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
    const pos = r + ',' + c;
    if (flags.has(pos) || revealed.has(pos)) return;
    const cell = cells[r][c];
    revealed.add(pos);
    cell.classList.add('revealed');

    if (minePositions.has(pos)) {
      cell.textContent = '💣';
      alert('Game Over!');
      revealAllMines();
      stopTimer(); // Stop the timer here
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
    const pos = r + ',' + c;
    if (revealed.has(pos)) return;
    const cell = cells[r][c];
    if (flags.has(pos)) {
      // Remove flag
      flags.delete(pos);
      cell.textContent = '';
      cell.classList.remove('flagged');
    } else {
      // Add flag
      flags.add(pos);
      cell.textContent = '🚩';
      cell.classList.add('flagged');
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
      stopTimer(); // Stop the timer here
    }
  }

  difficultySelect.addEventListener('change', initGame);

  initGame();
});

function formatTime(seconds) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

function startTimer() {
  clearInterval(timerInterval); // reset if already running
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("elapsed-time").textContent = formatTime(elapsedSeconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}
