class WeaponType {
    constructor(name, color, range, damageType) {
        this.name = name;
        this.color = color;
        this.range = range;
        this.damageType = damageType;
    }

    matchProperty (protertyName) {
        let compareProperty = protertyName.toLowerCase();
        return this.color === compareProperty ||
            this.range === compareProperty ||
            this.damageType === compareProperty;
    }
}