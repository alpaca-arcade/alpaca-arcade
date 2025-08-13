appendHighScoreTables();

/**
*
* Creates and appends the leaderboards to the DOM
* @returns {void} - Modifies DOM-element
*/
function appendHighScoreTables(){
const container = document.querySelector("div.leaderboards");
const highScoreLists = {"Easy": minesweeperScoresEasy, "Medium": minesweeperScoresMedium, "Hard": minesweeperScoresHard}

for (const [difficulty, scoreList] of Object.entries(highScoreLists)) {
    sortScores(scoreList)

    const lbContainer = document.createElement("div");
    lbContainer.classList.add("leaderboard");
    lbContainer.innerHTML = `
    <h3>${difficulty}</h3>
    <table>
        ${getTableHead(scoreList[0])}
        ${getTableBody(scoreList)}
        </table>
    `
    container.appendChild(lbContainer);
    }
}

/**
 * Creates and adds a headrow to the table
 * @param {Object} scoreObject - A score object to extract column names from
 * @returns {string} - Returns stringified tablehead
 */
function getTableHead(scoreList){
    if (!scoreList) return "";

    const column_names = Object.keys(scoreList);
    let headHTML = '<thead><tr>';
    
    for (const column_name of column_names) {
        headHTML += `<th>${capitalize(column_name)}</th>`;
    }
    
    headHTML += '</tr></thead>';
    return headHTML;
}

/**
 * Creates and adds a table body to the table
 * @param {Array<{name: string, time: number}>} scoreList - Array of Score objects
 * @returns {string} - Returns stringified tableBody
 */
function getTableBody(scoreList){
    let bodyHTML = '<tbody>';
    
    if (scoreList.length == 0) {
        bodyHTML += '<tr><td>No data yet</td></tr>';
    } else {
        for (const score of scoreList) {
            bodyHTML += `<tr>
                <td class="name">${score.name}</td>
                <td class="value">${score.time}</td>
            </tr>`;
        }
    }
    
    bodyHTML += '</tbody>';
    return bodyHTML;
}

/**
 * Capitalizes the first letter of a given string
 * @param {string} str 
 * @returns {string}
 */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Sorts an array of scores in-place by time (ascending)
 * @param {Array<{name: string, time: number}>} scores - Array of score objects
 * @returns {Array} - Returns the same array, now sorted by time
 */
function sortScores(scores) {
    return scores.sort((a, b) => a.time - b.time);
}