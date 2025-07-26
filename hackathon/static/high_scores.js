const container = document.querySelector("div.high-scores");
const table = document.createElement("table");
table.classList.add("table");
thead = document.createElement("thead");
tbody = document.createElement("tbody");

theadrow = document.createElement("tr");
column_names = Object.keys(minesweeper_scores_easy[0]);
for (column_name of column_names) {
    th = document.createElement("th");
    th.textContent = column_name;
    theadrow.appendChild(th);
}
thead.appendChild(theadrow);

for (score of minesweeper_scores_easy) {
    tbodyrow = document.createElement("tr");
    score_name = document.createElement("td");
    score_name.textContent = score.name;
    tbodyrow.appendChild(score_name);
    score_value = document.createElement("td");
    score_value.textContent = score["score"];
    tbodyrow.appendChild(score_value);
    tbody.appendChild(tbodyrow);
}

table.appendChild(thead);
table.appendChild(tbody);

container.appendChild(table);


