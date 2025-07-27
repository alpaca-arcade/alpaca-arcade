const container = document.querySelector("div.high-scores");

const minesweeperEasy = newHighScoreTable("Easy", minesweeperScoresEasy);
container.appendChild(minesweeperEasy);

const minesweeperMedium = newHighScoreTable("Medium", minesweeperScoresMedium);
container.appendChild(minesweeperMedium);

const minesweeperHard = newHighScoreTable("Hard", minesweeperScoresHard);
container.appendChild(minesweeperHard);

function newHighScoreTable(difficulty, scores) {
    const container = document.createElement("div");
    const heading = document.createElement("h3");
    heading.textContent = difficulty;
    container.appendChild(heading);
    const table = document.createElement("table");
    table.classList.add("table");
    table.classList.add("table-dark");
    thead = document.createElement("thead");
    tbody = document.createElement("tbody");

    theadrow = document.createElement("tr");
    column_names = Object.keys(scores[0]);
    for (column_name of column_names) {
        th = document.createElement("th");
        th.textContent = capitalize(column_name);
        theadrow.appendChild(th);
    }
    thead.appendChild(theadrow);

    for (score of scores) {
        tbodyrow = document.createElement("tr");
        score_name = document.createElement("td");
        score_name.textContent = score.name;
        tbodyrow.appendChild(score_name);
        score_value = document.createElement("td");
        score_value.textContent = score["time"];
        tbodyrow.appendChild(score_value);
        tbody.appendChild(tbodyrow);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
    return container;

}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

console.log("Easy:", minesweeperScoresEasy);
console.log("Medium:", minesweeperScoresMedium);
console.log("Hard:", minesweeperScoresHard);
