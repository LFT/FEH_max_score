class Unit {
    constructor(jsonData) {
        this.name = jsonData.name;
        this.moveType = jsonData.moveType;
        this.weaponType = jsonData.weaponType;
        this.bst = jsonData.bst;
        this.hasSuperBoon = jsonData.hasSuperBoon;
        this.maxMerge = jsonData.maxMerge;
        // summoning status is
        // -1 : limited unit
        // 0 : 3 or 4 star
        // 1 : 5 star in the summoning pool
        // 2 : 5 star and seasonnal unit
        // 3 : legendary hero
        // 4 : legendary hero with the pair up/stat boost
        // 5 : mythical hero
        // 6 : mythical hero with the pair up/stat boost
        this.summoningStatus = jsonData.summoningStatus;
        this.isDancer = jsonData.isDancer
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
        if (withMerge && this.maxMerge) {
            bst += 3;
        }
        if (withDuel) {
            if (bst < 170 && this.hasDuel()) {
                bst = 170;
                a = 300;
            }
            if (bst < 175 && (this.summoningStatus === 4 || this.summoningStatus === 6)) {
                bst = 175;
            }
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
        if (!this.isLegendaryOrMythical()) {
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
            case "colorlessBeast":
                return "grey";
        }
    }

    getCssClass () {
        let cssClass;
        if (this.isSeasonnal()) {
            cssClass = "seasonal-";
        } else if (this.isLegendaryOrMythical()) {
            cssClass = "legendary-";
        } else if (this.isLimited()) {
            cssClass = "limited-";
        } else if (this.isClassic5()) {
            cssClass = "star-";
        } else {
            cssClass = "";
        }
        return cssClass + "hero-icon";
    }

    isClassic5 () {
        return this.summoningStatus === 1;
    }

    isClassicCommon () {
        return this.summoningStatus === 0;
    }

    isLegendaryOrMythical() {
        return this.summoningStatus > 2;
    }

    isSeasonnal() {
        return this.summoningStatus === 2;
    }

    isLimited() {
        return this.summoningStatus === -1;
    }

    hasDuel () {
        return this.moveType === "infantry" && (this.getColor() !== "red" && this.getColor() !== "blue") ||
            this.moveType === "flier" && this.getColor() !== "grey";
    }
}


// to replace generated unit list: (\{[^}]+\}) -> new Unit\(\1\)
// pictures created using sprity create ./out *.png -e jimp -s icons.css
// pictures created using sprity create ./out heroes/*.png -e jimp -s heroes.css