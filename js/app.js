'use strict';
const scores = {
    "numberOfBlessing" : 0,
    "merge" : true,
    "boon" : true,
    "duel" : true,
    "season" : true,
    "star5" : true,
    "limited" : true,
    "bonus" : false,
    "bonusUnits" : ["BH-Hector", "BH-Ephraim", "BH-Celica", "BH-Veronica", "Narcian","Gordin", "Palla", "R-Olwen", "Lute", "Sharena"],
    "includedMoveTypes" : ["infantry", "flier", "cavalry", "armor"],
    "columnList" : ["sword", "redBreath", "redBow", "redTome", "lance", "blueBreath", "blueBow", "blueTome", "axe", "greenBreath", "greenBow", "greenTome", "breath", "bow", "dagger", "staff"],
    "scoreList" : [],
    "unitScoreList" : {}
};
const weaponGroups = ["Clear all", "All", "Melee", "Ranged", "Physical", "Magical", "Red", "Blue", "Green", "Colorless"];
const columnList = ["sword", "redBreath", "redBow", "redTome", "lance", "blueBreath", "blueBow", "blueTome", "axe", "greenBreath", "greenBow", "greenTome", "breath", "bow", "dagger", "staff"];
const moveTypes = ["infantry", "flier", "cavalry", "armor"];

function generateScoreList() {
    scores.scoreList = [];
    for (let unit in units) {
        let realUnit = units[unit];
        if ((scores.star5 || !realUnit.only5Star) &&
            (scores.season || !realUnit.seasonnal) &&
            (scores.limited || !realUnit.limited) &&
            scores.includedMoveTypes.indexOf(realUnit.moveType) > -1 &&
            (!scores.bonus || scores.bonusUnits.indexOf(unit) > -1)) {
            let score = realUnit.calculateScore(scores.numberOfBlessing, scores.merge, scores.boon, scores.duel);
            if (scores.scoreList.indexOf(score) === -1) {
                scores.scoreList.push(score);
                scores.unitScoreList[score] = {};
            }
            if (!scores.unitScoreList[score][realUnit.weaponType]) {
                scores.unitScoreList[score][realUnit.weaponType] = [];
            }
            scores.unitScoreList[score][realUnit.weaponType].push(realUnit);
        }
    }
    scores.scoreList.sort().reverse();
}

function add1x1Cell(grid, x, y, content, contentType, className) {
    let cell = document.createElement("div");
    switch (contentType) {
        case "score":
            cell.textContent = content;
            break;
        case "weapon" :
            let img = document.createElement("i");
            img.className = "ib icon icon-" + content;
            cell.appendChild(img);
            break;
        case "unit" :
            for (let i = 0; i < content.length; i++) {
                let wikiLink = document.createElement("a");
                wikiLink.href = "https://feheroes.gamepedia.com/" + content[i].wikiLink;
                wikiLink.target = "_blank";
                let img = document.createElement("i");
                img.className = "ib hero-icon icon-" + content[i].name;
                wikiLink.appendChild(img);
                cell.appendChild(wikiLink);
            }
            break;
    }
    cell.style.gridColumn = x + " / span 1";
    cell.style.gridRow = y + " / span 1";
    cell.className = className;
    grid.appendChild(cell);
}

function drawMatrix() {
    let grid = document.getElementById("unit-display");
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    for (let i = 0; i < scores.columnList.length; i++) {
        add1x1Cell(grid,2 + i, 1, scores.columnList[i], "weapon", "grid-weapons");
    }
    for (let i = 0; i < scores.scoreList.length; i++) {
        let score = scores.scoreList[i];
        let unitWithScore = false;
        for (let j = 0; j < scores.columnList.length; j++) {
            let weaponType = scores.columnList[j];
            if (scores.unitScoreList[score][weaponType]) {
                unitWithScore = true;
                let className = i % 2 === 0 ? "even" : "odd";
                add1x1Cell(grid, j + 2, i + 2, scores.unitScoreList[score][weaponType], "unit", "grid-units " + className);
            }
        }
        if (unitWithScore) {
            add1x1Cell(grid, 1, 2 + i, score, "score", "grid-scores");
        }
    }
}

function generateCheckboxes(columnTemplate, name) {
    let clone = document.importNode(columnTemplate.content, true);
    let cloneImg = clone.querySelector("i");
    cloneImg.className = "ib icon icon-" + name;
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
    scores.columnList.splice(0);
    let checkBoxes = document.getElementsByClassName("column-checkbox");
    for (let i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked) {
            scores.columnList.push(checkBoxes[i].name);
        }
    }
}

function handleCheck(evt) {
    updateWeaponList();
    drawMatrix();
}

function updateMoveFilters () {
    scores.includedMoveTypes.splice(0);
    let checkBoxes = document.getElementsByClassName("deplacement-checkbox");
    for (let i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked) {
            scores.includedMoveTypes.push(checkBoxes[i].name);
        }
    }
}

function handleGroup(evt) {
    let group = evt.target.name;
    if (group === "Clear all" || group === "All") {
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

function handleUnits(evt) {
    switch (evt.target.name) {
        case "star5":
        case "season" :
        case "boon" :
        case "duel" :
        case "merge" :
        case "limited" :
        case "bonus" :
            scores[evt.target.name] = evt.target.checked;
        break;
        case "blessings" :
            scores.numberOfBlessing = Number.parseInt(evt.target.value, 10);
            break;
        default:
            updateMoveFilters();
        break;
    }
    generateScoreList();
    drawMatrix();
}

function init() {
    generateScoreList(0);
    drawMatrix();
    let template = document.getElementById("checkbox-template");
    let groups = document.getElementById("column-groups");
    let container = document.getElementById("column-checkboxes");
    let moveTemplate = document.getElementById("checkbox-deplacement-template");
    let moveContainer = document.getElementById("unit-checkboxes");
    let scoreContainer = document.getElementById("score-inputs");
    for (let i = 0; i < weaponTypes.length; i++) {
        container.appendChild(generateCheckboxes(template, weaponTypes[i].name));
    }
    for (let i = 0; i < weaponGroups.length; i++) {
        groups.appendChild(generateButton(weaponGroups[i]));
    }
    for (let i = 0; i < moveTypes.length; i++) {
        moveContainer.appendChild(generateCheckboxes(moveTemplate, moveTypes[i]));
    }
    container.addEventListener("change", handleCheck);
    groups.addEventListener("click", handleGroup);
    moveContainer.addEventListener("click", handleUnits);
    scoreContainer.addEventListener("change", handleUnits);
}
document.addEventListener("DOMContentLoaded", init);