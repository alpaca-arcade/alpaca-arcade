const container = document.querySelector("div.high-scores");
const table = document.createElement("table");
table.classList.add("table");
thead = document.createElement("thead");
tbody = document.createElement("tbody");

theadrow = document.createElement("tr");
column_names = Object.keys(minesweeper_scores[0]);
for (column_name of column_names) {
    th = document.createElement("th");
    th.textContent = column_name;
    theadrow.appendChild(th);
}
thead.appendChild(theadrow);

for (minesweeper_score of minesweeper_scores) {
    tbodyrow = document.createElement("tr");
    score_name = document.createElement("td");
    score_name.textContent = minesweeper_score.name;
    tbodyrow.appendChild(score_name);
    score = document.createElement("td");
    score.textContent = minesweeper_score["score"];
    tbodyrow.appendChild(score);
    tbody.appendChild(tbodyrow);
}

table.appendChild(thead);
table.appendChild(tbody);

container.appendChild(table);


