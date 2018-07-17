
function init() {
    let grid = document.getElementById("unitDisplay");
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    let gridMatrice =  { "sword" : [] ,
    "lance": [] ,
    "axe" : [] };
    for (let unit in units) {
        let realUnit = units[unit];
        if (gridMatrice[realUnit.weaponType]) {
            gridMatrice[realUnit.weaponType].push(unit);
        }

    }
    var currentColumn = 1;
    for (let weaponType in gridMatrice) {
        let weaponUnits = gridMatrice[weaponType];
        let weaponSpan = document.createElement("div");
        weaponSpan.style.gridColumn = currentColumn + " / span 1";
        weaponSpan.style.gridRow = "1 / 2";
        weaponSpan.textContent =  weaponType;
        let span = document.createElement("div");
        span.textContent =  weaponUnits.join(", ");
        span.style.gridColumn = currentColumn + " / span 1";
        span.style.gridRow = "2 / 3";
        grid.appendChild(weaponSpan);
        grid.appendChild(span);
        currentColumn++;
    }
}
document.addEventListener("DOMContentLoaded", init);