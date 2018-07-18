var scores = {
    "scoreList" : [],
    "unitScoreList" : {}
};
var columList = ["sword", "redTome", "lance", "blueTome", "axe", "greenTome"];

function generateScoreList(numberOfBlessing, withMerge, withSuperBoon) {
    scoreList = {};
    for (let unit in units) {
        let realUnit = units[unit];
        let score = realUnit.calculateScore(numberOfBlessing, withMerge, withSuperBoon);
        if (scores.scoreList.indexOf(score) === -1) {
            scores.scoreList.push(score);
            scores.unitScoreList[score] = {};
        }
        if (!scores.unitScoreList[score][realUnit.weaponType]) {
            scores.unitScoreList[score][realUnit.weaponType] = [];
        }
        scores.unitScoreList[score][realUnit.weaponType].push(unit);
    }
    scores.scoreList.sort().reverse();
}

function add1x1Cell(grid, content, x, y) {
    let cell = document.createElement("div");
    cell.textContent =  content;
    cell.style.gridColumn = x + " / span 1";
    cell.style.gridRow = y + " / span 1";
    grid.appendChild(cell);
}

function drawMatrix(grid) {
    for (let i = 0; i < columList.length; i++) {
        add1x1Cell(grid, columList[i], 2 + i, 1);
    }
    for (let i = 0; i < scores.scoreList.length; i++) {
        let score = scores.scoreList[i];
        let unitWithScore = false;
        for (let j = 0; j < columList.length; j++) {
            let weaponType = columList[j];
            if (scores.unitScoreList[score][weaponType]) {
                unitWithScore = true;
                add1x1Cell(grid, scores.unitScoreList[score][weaponType].join(", "), j + 2, i + 2);
            }
        }
        if (unitWithScore) {
            add1x1Cell(grid, score, 1, 2 + i);
        }
    }
}
function init() {
    let grid = document.getElementById("unitDisplay");
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    generateScoreList(0, true, true);
    drawMatrix(grid);
}
document.addEventListener("DOMContentLoaded", init);