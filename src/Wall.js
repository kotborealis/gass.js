class Wall {
    /** @type {Vector} **/
    a;

    /** @type {Vector} **/
    b;

    /**
     *
     * @param {Vector} positionA
     * @param {Vector} positionB
     */
    constructor(positionA, positionB) {
        this.a = positionA.copy();
        this.b = positionB.copy();
    }
}