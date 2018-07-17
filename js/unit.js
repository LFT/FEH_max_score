class Unit {
    constructor(jsonData) {
        this.name = jsonData.name;
        this.moveType = jsonData.moveType;
        this.weaponType = jsonData.weaponType;
        this.bst = jsonData.bst;
        this.hasSuperBoon = jsonData.hasSuperBoon;
        this.maxSp = jsonData.maxSp;
        this.maxMerge = jsonData.maxMerge;
        this.isLegendary = jsonData.isLegendary;
        this.seasonnal = jsonData.seasonnal;
        this.only5Star = jsonData.only5Star;
    }

    calculateScore (numberOfBlessing, withMerge, withSuperBoon) {
        // base score  + rarity value + level value
        var score = 150 +  55 + 93;
        // adding bst
        score += Math.floor((this.bst + (withSuperBoon && this.hasSuperBoon ? 1 : 0)) / 5)
        // adding sp
        score += Math.floor(this.maxSp / 100)
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
}


// to replace generated unit list: (\{[^}]+\}) -> new Unit\(\1\)