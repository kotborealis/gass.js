class Wall {
    /** @type {Vector} **/
    a;

    /** @type {Vector} **/
    b;

    /** @type {Vector} **/
    velocity = Vector.zero();

    /**
     *
     * @param {Vector} positionA
     * @param {Vector} positionB
     * @param {Vector} velocity
     */
    constructor(positionA, positionB, velocity = Vector.zero()) {
        this.a = positionA.copy();
        this.b = positionB.copy();
        this.velocity = velocity.copy();
    }
}