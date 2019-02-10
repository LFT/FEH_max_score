class Unit {
    constructor(jsonData) {
        this.name = jsonData.name;
        this.moveType = jsonData.moveType;
        this.weaponType = jsonData.weaponType;
        this.bst = jsonData.bst;
        this.hasSuperBoon = jsonData.hasSuperBoon;
        this.maxMerge = jsonData.maxMerge;
        this.isLegendary = jsonData.isLegendary;
        this.seasonnal = jsonData.seasonnal;
        this.only5Star = jsonData.only5Star;
        this.isDancer = jsonData.isDancer
        this.limited = jsonData.limited;
        this.wikiLink = jsonData.link;
        this.weapon = jsonData.weapon;
        this.assist = jsonData.assist;
        this.special = jsonData.special;
        this.a = jsonData.a;
        this.b = jsonData.b;
        this.c = jsonData.c;
        this.seal= jsonData.seal;
    }

    calculateScore (numberOfBlessing, withMerge, withSuperBoon, withDuel, withDance) {
        // base score  + rarity value + level value
        let score = 150 +  55 + 93;
        // adding bst
        let a = this.a;
        let bst = this.bst;
        if (withMerge) {
            bst += 3;
        }
        if (withDuel && bst < 170 &&
            (this.moveType === "infantry" &&
                (this.getColor() === "green" || this.getColor() === "grey") ||
            this.moveType === "flier" &&
                (this.getColor() === "red" || this.getColor() === "blue"))) {
            bst = 170;
            a = 300;
        }
        let assist = this.assist;
        if (withDance && this.isDancer) {
            assist = 150;
        }
        score += Math.floor((bst + (withSuperBoon && this.hasSuperBoon ? 1 : 0)) / 5);
        // adding sp
        let sp = this.weapon + assist + this.special + a + this.b + this.c + this.seal;
        score += Math.floor(sp / 100);
        // adding merges
        if (withMerge) {
            score += 2 * this.maxMerge;
        }
        // adding blessings
        if (!this.isLegendary) {
            score += numberOfBlessing * 4;
        }
        // Using a bonus unit.
        return score * 2;
    }

    getColor () {
        // TODO : use the weapon type list?
        switch (this.weaponType) {
            case "sword":
            case "redBreath":
            case "redBow":
            case "redTome":
                return "red";
            case "lance":
            case "blueBreath":
            case "blueBow":
            case "blueTome":
                return "blue";
            case "axe":
            case "greenBreath":
            case "greenBow":
            case "greenTome":
                return "green";
            case "breath":
            case "bow":
            case "dagger":
            case "staff":
                return "grey";
        }
    }

    getCssClass () {
        let cssClass;
        if (this.seasonnal) {
            cssClass = "seasonal-";
        } else if (this.isLegendary) {
            cssClass = "legendary-";
        } else if (this.limited) {
            cssClass = "limited-";
        } else if (this.only5Star) {
            cssClass = "star-";
        } else {
            cssClass = "";
        }
        return cssClass + "hero-icon";
    }

    isClassic5 () {
        return this.only5Star && !this.seasonnal && !this.isLegendary;
    }

    isClassicCommon () {
        return !(this.only5Star || this.isLegendary || this.seasonnal || this.limited);
    }
}


// to replace generated unit list: (\{[^}]+\}) -> new Unit\(\1\)
// pictures created using sprity create ./out *.png -e jimp -s icons.css
// pictures created using sprity create ./out heroes/*.png -e jimp -s heroes.css