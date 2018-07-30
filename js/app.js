const scores = {
    "scoreList" : [],
    "unitScoreList" : {}
};
const weaponGroups = ["Clean", "All", "Melee", "Ranged", "Physical", "Magical", "Red", "Blue", "Green", "Colorless"];
const columnList = ["sword", "redBreath", "redTome", "lance", "blueBreath", "blueBow", "blueTome", "axe", "greenBreath", "greenBow", "greenTome", "breath", "bow", "dagger", "staff"];

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

function add1x1Cell(grid, content, x, y, isTextContent) {
    let cell = document.createElement("div");
    if (isTextContent) {
        cell.textContent =  content;
    } else {
        cell.appendChild(content);
    }
    cell.style.gridColumn = x + " / span 1";
    cell.style.gridRow = y + " / span 1";
    grid.appendChild(cell);
}

function drawMatrix() {
    let grid = document.getElementById("unit-display");
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    for (let i = 0; i < columnList.length; i++) {
        let img = document.createElement("img");
        img.src = "pictures/" + columnList[i] + ".png";
        img.alt = columnList[i];
        add1x1Cell(grid, img, 2 + i, 1, false);
    }
    for (let i = 0; i < scores.scoreList.length; i++) {
        let score = scores.scoreList[i];
        let unitWithScore = false;
        for (let j = 0; j < columnList.length; j++) {
            let weaponType = columnList[j];
            if (scores.unitScoreList[score][weaponType]) {
                unitWithScore = true;
                add1x1Cell(grid, scores.unitScoreList[score][weaponType].join(", "), j + 2, i + 2, true);
            }
        }
        if (unitWithScore) {
            add1x1Cell(grid, score, 1, 2 + i, true);
        }
    }
}

function generateCheckboxes(columnTemplate, name) {
    let clone = document.importNode(columnTemplate.content, true);
    let cloneImg = clone.querySelector("img");
    cloneImg.src = "pictures/" + name + ".png";
    cloneImg.alt = name;
    let cloneInput = clone.querySelector("input");
    cloneInput.name = name;
    return clone;
}

function generateButton(name) {
    let generatedButton = document.createElement("button");
    generatedButton.textContent = name;
    generatedButton.name = name;
    return generatedButton;
}

// We go for reset and reading each time.
// Probably not the best performance wise, but the code is much simpler.
function updateWeaponList() {
    columnList.splice(0);
    let checkBoxes = document.getElementsByClassName("column-checkbox");
    for (let i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked) {
            columnList.push(checkBoxes[i].name);
        }
    }
}

function handleCheck(evt) {
    updateWeaponList();
    drawMatrix();
}
// MoveType
function handleGroup(evt) {
    let group = evt.target.name;
    if (group === "Clean" || group === "All") {
        let checkBoxes = document.getElementsByClassName("column-checkbox");
        for (let i = 0; i < checkBoxes.length; i++) {
            checkBoxes[i].checked = group === "All";
        }
    } else {
        for (let i = 0; i < weaponTypes.length; i++) {
            if (weaponTypes[i].matchProperty(group)) {
                let weaponCheckbox = document.getElementsByName(weaponTypes[i].name)[0];
                if (!weaponCheckbox.checked) {
                    weaponCheckbox.checked = true;
                }
            }
        }
    }
    updateWeaponList();
    drawMatrix();
}
function init() {
    generateScoreList(0, true, true);
    drawMatrix();
    let template = document.getElementById("checkbox-template");
    let groups = document.getElementById("column-groups");
    let container = document.getElementById("column-checkboxes");
    for (let i = 0; i < weaponTypes.length; i++) {
        container.appendChild(generateCheckboxes(template, weaponTypes[i].name));
    }
    for (let i = 0; i < weaponGroups.length; i++) {
        groups.appendChild(generateButton(weaponGroups[i]));
    }
    container.addEventListener("change", handleCheck);
    groups.addEventListener("click", handleGroup);
}
document.addEventListener("DOMContentLoaded", init);