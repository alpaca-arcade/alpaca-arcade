import { GameWon, GameOver } from "/static/gameover.js"

document.addEventListener('DOMContentLoaded', () => {

// ========================================
// DOM ELEMENTS & GLOBAL VARIABLES
// ========================================

const grid = document.getElementsByClassName('board')[0];
const playButton = document.getElementById('play-button');
const restartButton = document.getElementById("restart-button");
const allDifficultyRadios = document.querySelectorAll('#difficultySelection input[type="radio"]');
const allGridInfoDifficultyModal = document.querySelectorAll("[data-difficulty]");

let difficulty = "medium";
let isGameRunning = false;
let rows, cols, mines, remainingBombs;
let cells = [];
let minePositions = new Set();
let flags = new Set();
let revealed = new Set();
let timerInterval, startTime, timeElapsed;

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Capitalizes the first letter of a string.
 * @param {string} s - The string to capitalize
 * @returns {string} The string with the first letter capitalized
 * @example
 * capitalize("easy"); // Returns "Easy"
 * capitalize("HARD"); // Returns "HARD"
 */
function capitalize(s) {
    return String(s[0]).toUpperCase() + String(s).slice(1);
}

/**
 * Formats seconds into HH:MM:SS time display format.
 * @param {number} seconds - The number of seconds to format
 * @returns {string} Formatted time string in HH:MM:SS format
 * @example
 * formatTime(3661); // Returns "01:01:01"
 * formatTime(125);  // Returns "00:02:05"
 */
function formatTime(seconds) {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

// ========================================
// TIMER FUNCTIONS
// ========================================

/**
 * Starts the game timer and updates the display every second.
 * Clears any existing timer before starting a new one to prevent
 * multiple timers running simultaneously.
 */
function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById("elapsed-time").textContent = formatTime(elapsedSeconds);
        timeElapsed = elapsedSeconds;
    }, 1000);
}

/**
 * Stops the game timer by clearing the interval.
 */
function stopTimer() {
    clearInterval(timerInterval);
}

/**
 * Starts the game timer and resets the display.
 */
function startGameTimer() {
    document.getElementById("elapsed-time").textContent = "00:00:00";
    startTimer();
}

// ========================================
// GAME STATE FUNCTIONS
// ========================================

/**
 * Initializes a new minesweeper game with the current difficulty settings.
 */
function initGame() {
    resetGameState();
    const gameConfig = getDifficultyConfig(difficulty);
    setupGameGrid(gameConfig);
    startGameTimer();
}

/**
 * Resets all game state variables to their initial values.
 */
function resetGameState() {
    if (!isGameRunning) isGameRunning = true;
    
    grid.innerHTML = '';
    cells = [];
    minePositions.clear();
    flags.clear();
    revealed.clear();
}

/**
 * Gets the configuration (rows, cols, mines) for the specified difficulty.
 * @param {string} difficultyLevel - The difficulty level to configure
 * @returns {Object} Configuration object with rows, cols, and mines properties
 */
function getDifficultyConfig(difficultyLevel) {
    switch (difficultyLevel) {
        case 'easy':
            return { rows: 8, cols: 8, mines: 10 };
        case 'medium':
            return { rows: 16, cols: 16, mines: 40 };
        case 'hard':
            return { rows: 24, cols: 24, mines: 99 };
        case 'custom':
            return getCustomDifficultyConfig();
        default:
            alert('Something went wrong, reverting to default difficulty!\nPlease contact a dev to look into this.');
            return { rows: 16, cols: 16, mines: 40 };
    }
}

/**
 * Gets custom difficulty configuration from user input.
 * @returns {Object} Configuration object with custom rows, cols, and mines
 */
function getCustomDifficultyConfig() {
    const allInputs = document.querySelectorAll('#difficultySelection input[type="number"]');
    return {
        rows: parseInt(allInputs[0].value),
        cols: parseInt(allInputs[1].value),
        mines: parseInt(allInputs[2].value)
    };
}

function checkWin() {
    if (revealed.size === rows * cols - mines) {
        stopGame(true);
    }
}

/**
 * Ends the current game and displays the appropriate result modal.
 * Stops the timer, reveals all mines, and shows win/lose screen.
 * @param {boolean} isWinner - True if player won, false if they lost
 */
function stopGame(isWinner) {
    isGameRunning = false;
    stopTimer();
    revealAllMines();
    openEndModalAsWinner(isWinner);
}

/**
 * Restarts the current game with the same difficulty settings.
 * Resets the board, timer, and game state without reopening difficulty selection.
 */
function restartGame() {
    initGame();
}

// ========================================
// GRID & CELL FUNCTIONS
// ========================================

/**
 * Sets up the game grid with the specified configuration.
 * @param {Object} config - Configuration object with rows, cols, and mines
 */
function setupGameGrid(config) {
    rows = config.rows;
    cols = config.cols;
    mines = config.mines;
    remainingBombs = mines;
    
    adjustBombCounter(0);
    setupGridLayout();
    createGridCells();
}

/**
 * Configures the CSS grid layout based on current rows and columns.
 */
function setupGridLayout() {
    grid.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 40px)`;
}

/**
 * Creates all cell elements and adds them to the grid with event listeners.
 */
function createGridCells() {
    for (let r = 0; r < rows; r++) {
        cells[r] = [];
        for (let c = 0; c < cols; c++) {
            const cell = createSingleCell(r, c);
            grid.appendChild(cell);
            cells[r][c] = cell;
        }
    }
}

/**
 * Creates a single cell element with appropriate event listeners.
 * @param {number} r - Row index
 * @param {number} c - Column index
 * @returns {HTMLElement} The created cell element
 */
function createSingleCell(r, c) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.row = r;
    cell.dataset.col = c;
    
    cell.addEventListener('click', firstClick)
    cell.addEventListener('click', () => revealCell(r, c));
    cell.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        toggleFlag(r, c);
    });
    
    return cell;
}

/**
 * Reveals a cell in the minesweeper grid at the specified position.
 * 
 * This function handles the core game logic when a player clicks on a cell.
 * It checks if the game is running, validates the position, and either
 * reveals a safe cell or triggers a mine explosion.
 * 
 * @param {number} r - The row index of the cell to reveal
 * @param {number} c - The column index of the cell to reveal
 * @returns {void}
 * 
 * @example
 * // Reveal the cell at row 2, column 3
 * revealCell(2, 3);
 */
function revealCell(r, c) {
    if (!canRevealCell(r, c)) return;
    
    const pos = r + ',' + c;
    markCellAsRevealed(r, c, pos);
    
    if (minePositions.has(pos)) {
        handleMineExplosion(r, c);
        return;
    }
    
    handleSafeCell(r, c);
    checkWin();
}

/**
 * Checks if a cell can be revealed based on game state and cell status.
 * @param {number} r - Row index
 * @param {number} c - Column index  
 * @returns {boolean} True if cell can be revealed, false otherwise
 */
function canRevealCell(r, c) {
    if (!isGameRunning) return false;
    const pos = r + ',' + c;
    return !flags.has(pos) && !revealed.has(pos);
}

function markCellAsRevealed(r, c, pos) {
    revealed.add(pos);
    cells[r][c].classList.add('revealed');
}

function handleMineExplosion(r, c) {
    cells[r][c].textContent = '💣';
    stopGame(false);
}

/**
 * Handles the logic when a safe (non-mine) cell is revealed.
 * Shows adjacent mine count with appropriate color styling, or triggers 
 * flood-fill for empty cells. Each number gets a unique CSS class for
 * authentic minesweeper color coding.
 * 
 * @param {number} r - Row index
 * @param {number} c - Column index
 */
function handleSafeCell(r, c) {
    const count = countAdjacentMines(r, c);
    if (count > 0) {

        cells[r][c].textContent = count;
        cells[r][c].classList.add(`number-${count}`);
    } else {
        revealAdjacentEmptyCells(r, c);
    }
}

/**
 * Reveals adjacent empty cells when a cell with no adjacent mines is clicked.
 * This creates the "flood fill" effect typical in minesweeper games.
 * @param {number} r - Row index of the center cell
 * @param {number} c - Column index of the center cell
 */
function revealAdjacentEmptyCells(r, c) {
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

/**
 * Toggles a flag on a cell.
 * 
 * If the cell is unflagged, adds a flag (if bombs remaining > 0).
 * If the cell is already flagged, removes the flag.
 * Updates the bomb counter and cell appearance accordingly.
 * 
 * @param {number} r - The row index of the cell
 * @param {number} c - The column index of the cell
 * @returns {void}
 * 
 * @example
 * // Toggle flag on cell at row 2, column 3
 * toggleFlag(2, 3);
 */
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

/**
 * Adjusts the remaining bomb counter by the specified value.
 * Updates both the internal counter and the display.
 * @param {number} value - The amount to adjust the counter (positive or negative)
 * @example
 * adjustBombCounter(-1); // Decrease by 1 (flag placed)
 * adjustBombCounter(1);  // Increase by 1 (flag removed)
 * adjustBombCounter(0);  // No change to count, but refreshes the display
 */
function adjustBombCounter(value) {
    remainingBombs += value;
    document.getElementById("bomb-count").innerHTML = remainingBombs;
}

// ========================================
// MINE FUNCTIONS
// ========================================

/**
 * Randomly places mines on the game board.
 * 
 * Generates random positions until the required number of mines are placed.
 * Uses a Set to ensure no duplicate mine positions are created, continuing
 * to generate new random positions until all mines are successfully placed.
 * 
 * @returns {void}
 */
function placeMines(index) {
    const row = Math.floor(index / cols);
    const col = index % cols;

    const fcPos = row + ',' + col
    while (minePositions.size < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        const pos = r + ',' + c;
        if (!minePositions.has(pos) && pos != fcPos) {
            minePositions.add(pos);
        }
    }
}

/**
 * Activates on the first reveal of a cell, to ensure no bombs are triggered before the game even really starts
 * @param {Event} - event via the eventHandler
 */
function firstClick(event){
    const indexOfClick = Array.from(event.target.parentNode.children).indexOf(event.target)
    const boardTiles = document.querySelector(".board").children
    Array.from(boardTiles).forEach(tile => tile.removeEventListener('click', firstClick));
    placeMines(indexOfClick)
}
/**
 * Counts the number of mines adjacent to a given cell.
 * 
 * Checks all 8 surrounding cells (horizontally, vertically, and diagonally)
 * to determine how many contain mines. This count is displayed
 * on the cell when revealed.
 * 
 * @param {number} r - The row index of the cell to check
 * @param {number} c - The column index of the cell to check
 * @returns {number} The number of adjacent mines (0-8)
 * 
 */
function countAdjacentMines(r, c) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue; // Skip the center cell
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

/**
 * Reveals all mines on the game board.
 * 
 * This function is used to show where all the mines were located,
 * after they've either won the game or triggered a mine explosion.
 * Each mine cell is marked with a bomb emoji and styled with the 'mine' class.
 * 
 * @returns {void}
 * 
 */
function revealAllMines() {
    minePositions.forEach(pos => {
        const [r, c] = pos.split(',').map(Number);
        const cell = cells[r][c];
        cell.textContent = '💣';
        cell.classList.add('mine');
    });
}

// ========================================
// UI/MODAL FUNCTIONS
// ========================================

/**
 * Opens the end-game modal dialog with appropriate content based on game outcome.
 * 
 * This function displays a modal when the game concludes, showing
 * either a victory screen or a game over screen.
 * The modal content is dynamically generated based on whether the player won or lost.
 * 
 * @param {boolean} isWinner - True if the player won the game, false if they lost
 * @returns {void}
 * 
 */
function openEndModalAsWinner(isWinner) {
    const modal = document.getElementById("end-game-modal");
    modal.innerHTML = "";
    modal.showModal();
    if (isWinner) {
        modal.appendChild(new GameWon(timeElapsed, difficulty, hcaptcha));
    } else {
        modal.appendChild(new GameOver());
    }
}

/**
 * Opens the difficulty selection modal and handles browser compatibility.
 * 
 * Includes a browser compatibility workaround for browsers that don't
 * reset radio button state when page is refreshed (confirmed in Firefox,
 * potentially other browsers). Ensures custom difficulty fields are
 * shown if custom radio remains selected.
 */
function openDifficultyModal() {
    document.getElementById("difficultySelection").showModal();
    
    let customSelected = document.getElementById("custom");
    
    // Browser compatibility fix: Some browsers (Firefox confirmed, possibly Edge/others)
    // don't reset radio buttons when page is refreshed, so manually show custom fields
    // if custom difficulty is still selected
    if (customSelected.checked) {
        document.getElementById("custom-fields").classList.remove("display-none");
    }
}

// ========================================
// DIFFICULTY SELECTION FUNCTIONS
// ========================================

/**
 * Sets up event listeners for difficulty selection radio buttons.
 * 
 * When a difficulty is selected, hides all difficulty info panels and
 * shows only the panel corresponding to the selected difficulty.
 * Custom difficulty selection shows no info panel.
 * 
 * @returns {void}
 */
function setupDifficultyRadioListeners() {
    allDifficultyRadios.forEach((el) => {
        el.addEventListener("click", () => {
            allGridInfoDifficultyModal.forEach((elem) => elem.classList.add("ghost"));
            if(el.value == "custom") { return; }
            document.querySelector(`[data-difficulty="${el.value}"]`).classList.remove("ghost");
        })
    })
}

/**
 * Sets up the difficulty selection form submission handler.
 */
function setupDifficultySelectionHandler() {
    document.querySelector("#difficultySelection button").addEventListener('click', handleDifficultySubmission);
}

/**
 * Handles difficulty selection form submission and validation.
 * @param {Event} event - The form submission event
 */
function handleDifficultySubmission(event) {
    event.preventDefault();
    
    const selectedValue = document.querySelector('input[name="difficulty"]:checked').value;
    
    if (selectedValue === 'custom') {
        if (!validateCustomDifficulty()) return;
    }
    
    applyDifficultySelection(selectedValue);
}

/**
 * Validates custom difficulty inputs and shows appropriate errors.
 * @returns {boolean} - True if validation passes, false otherwise
 */
function validateCustomDifficulty() {
    const inputs = document.querySelectorAll('#difficultySelection input[type="number"]');
    let isValid = true;
    
    // Check required fields
    inputs.forEach(input => {
        if (!input.value) {
            showFieldError(input.id, "Required field for custom");
            isValid = false;
        } else if (input.value < 2){
            isValid = false;
            showFieldError(input.id, "Value has to be 2 or higher")
        }
        else {
            hideFieldError(input.id);
        }
    });
    
    if (!isValid) return false;
    
    // Check bomb count doesn't exceed grid size
    const [rows, cols, bombs] = Array.from(inputs).map(input => parseInt(input.value));
    if (bombs >= (rows * cols - 1)) {
        showFieldError("bC", `Bomb count exceeds grid, MAX: ${rows * cols - 1}`);
        return false;
    }
    
    return true;
}

/**
 * Shows error message for a specific field.
 * @param {string} fieldId - The field identifier
 * @param {string} message - The error message to display
 */
function showFieldError(fieldId, message) {
    const errorMap = { "rC": "row-count-error", "cC": "col-count-error", "bC": "bomb-count-error" };
    const errorElement = document.getElementById(errorMap[fieldId]);
    errorElement.classList.remove("ghost");
    if (message) errorElement.innerHTML = message;
}

/**
 * Hides error message for a specific field.
 * @param {string} fieldId - The field identifier
 */
function hideFieldError(fieldId) {
    const errorMap = { "rC": "row-count-error", "cC": "col-count-error", "bC": "bomb-count-error" };
    document.getElementById(errorMap[fieldId]).innerHTML = "";
}

/**
 * Applies the selected difficulty and starts the game.
 * @param {string} difficultyValue - The selected difficulty value
 */
function applyDifficultySelection(difficultyValue) {
    difficulty = difficultyValue;
    document.querySelector("#current-difficulty").innerHTML = `Difficulty: ${capitalize(difficulty)}`;
    document.getElementById("difficultySelection").close();
    initGame();
}

// ========================================
// INITIALIZATION
// ========================================

// Set up event listeners
setupDifficultyRadioListeners();
setupDifficultySelectionHandler();
playButton.addEventListener('click', openDifficultyModal);
restartButton.addEventListener('click', restartGame);

// Start the initial game
initGame();

});
