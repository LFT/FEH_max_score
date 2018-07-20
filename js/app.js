const scores = {
    "scoreList" : [],
    "unitScoreList" : {}
};
const weaponTypes = ["sword", "redBreath", "redTome", "lance", "blueBreath", "blueTome", "axe", "greenBreath", "greenBow", "greenTome", "breath", "bow", "dagger", "staff"];
const weaponGroups = [{
    "name" : "All",
    "weapons" : ["sword", "redBreath", "redTome", "lance", "blueBreath", "blueTome", "axe", "greenBow", "greenBreath", "greenTome", "breath", "bow", "dagger", "staff"]
},
{
    "name" : "Melee",
    "weapons" : ["sword", "redBreath","lance", "blueBreath", "axe", "greenBreath", "breath"]
},
{
    "name" : "Range",
    "weapons" : ["redTome", "blueTome", "greenBow", "greenTome", "bow", "dagger", "staff"]
},
{
    "name" : "Physical",
    "weapons" : ["sword", "lance", "axe", "greenBow", "bow", "dagger"]
},
{
    "name" : "Magical",
    "weapons" : ["redBreath", "redTome", "blueBreath", "blueTome", "greenBreath", "greenTome", "bow", "dagger"]
},
{
    "name" : "Red",
    "weapons" : ["sword", "redBreath", "redTome"]
},
{
    "name" : "Blue",
    "weapons" : ["lance", "blueBreath", "blueTome"]
},
{
    "name" : "Green",
    "weapons" : ["axe", "greenBreath", "greenBow", "greenTome"]
},
{
    "name" : "Colorless",
    "weapons" : ["breath", "bow", "dagger", "staff"]
}
]
const columnList = ["sword", "redBreath", "redTome", "lance", "blueBreath", "blueTome", "axe", "greenBreath", "greenBow", "greenTome", "breath", "bow", "dagger", "staff"];

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
    let grid = document.getElementById("unit-display");
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

function generateButton(name) {
    let generatedButton = document.createElement("button");
    generatedButton.textContent = name;
    generatedButton.name = name;
    return generatedButton;
}
function addWeaponToList(weaponType) {
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

function handleCheck(evt) {
    let weaponType = evt.target.name;
    let currentIndex = columnList.indexOf(weaponType);
    if (evt.target.checked && currentIndex === -1) {
        addWeaponToList(weaponType);
    }
    if (!evt.target.checked && currentIndex !== -1) {
        columnList.splice(currentIndex, 1);
    }
    drawMatrix();
}

function handleGroup(evt) {
    let group = evt.target.name;
    if (group === "clean") {
        for (let i = 0; i < weaponTypes.length; i++) {
            let weaponCheckbox = document.getElementsByName(weaponTypes[i])[0];
            weaponCheckbox.checked = false;
        }
        columnList.splice(0);
    } else {
        let matchingWeapons;
        for (let i = 0; i < weaponGroups.length; i++) {
            if (weaponGroups[i].name === group) {
                matchingWeapons = weaponGroups[i].weapons
            }
        }
        for (let i = 0; i < matchingWeapons.length; i++) {
            let weaponCheckbox = document.getElementsByName(matchingWeapons[i])[0];
            if (!weaponCheckbox.checked) {
                weaponCheckbox.checked = true;
                addWeaponToList(matchingWeapons[i]);
            }
        }
    }
    drawMatrix();
}
function init() {
    generateScoreList(0, true, true);
    drawMatrix();
    let template = document.getElementById("checkbox-template");
    let groups = document.getElementById("column-groups");
    let container = document.getElementById("column-checkboxes");
    for (let i = 0; i < weaponTypes.length; i++) {
        container.appendChild(generateCheckboxes(template, weaponTypes[i]));
    }
    for (let i = 0; i < weaponGroups.length; i++) {
        groups.appendChild(generateButton(weaponGroups[i].name));
    }
    container.addEventListener("change", handleCheck);
    groups.addEventListener("click", handleGroup);
}
document.addEventListener("DOMContentLoaded", init);