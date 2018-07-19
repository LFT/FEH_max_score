const scores = {
    "scoreList" : [],
    "unitScoreList" : {}
};
const weaponTypes = ["sword", "redBreath", "redTome", "lance", "blueBreath", "blueTome", "axe", "greenBreath", "greenTome", "colorlessbreath", "bow", "dagger", "staff"];
const columnList = ["sword", "redBreath", "redTome", "lance", "blueBreath", "blueTome", "axe", "greenBreath", "greenTome", "colorlessbreath", "bow", "dagger", "staff"];


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

function drawMatrix() {
    let grid = document.getElementById("unitDisplay");
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    for (let i = 0; i < columnList.length; i++) {
        add1x1Cell(grid, columnList[i], 2 + i, 1);
    }
    for (let i = 0; i < scores.scoreList.length; i++) {
        let score = scores.scoreList[i];
        let unitWithScore = false;
        for (let j = 0; j < columnList.length; j++) {
            let weaponType = columnList[j];
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

function generateCheckboxes(columnTemplate, name) {
    let clone = document.importNode(columnTemplate.content, true);
    let cloneText = clone.querySelector("span");
    cloneText.textContent = name;
    let cloneInput = clone.querySelector("input");
    cloneInput.name = name;
    return clone;
}

function handleCheck(evt) {
    let weaponType = evt.target.name;
    let currentIndex = columnList.indexOf(weaponType);
    if (evt.target.checked && currentIndex === -1) {
        let i = 0;
        letMaxIndex = weaponTypes.indexOf(weaponType);
        for (i; i < columnList.length; i++) {
            let weaponIndex = weaponTypes.indexOf(columnList[i]);
            if (weaponIndex > letMaxIndex) {
                break;
            }
        }
        columnList.splice(i, 0, weaponType);
    }
    if (!evt.target.checked && currentIndex !== -1) {
        columnList.splice(currentIndex, 1);
    }
    drawMatrix();
}
function init() {
    generateScoreList(0, true, true);
    drawMatrix();
    let template = document.getElementById("columnTemplate");
    let container = document.getElementById("columnCheckboxes");
    for (let i = 0; i < weaponTypes.length; i++) {
        container.appendChild(generateCheckboxes(template, weaponTypes[i]));
    }
    container.addEventListener("change", handleCheck);
}
document.addEventListener("DOMContentLoaded", init);