import {Vector} from '../vector/Vector';

export class Wall {
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

/**
 *
 * @param {Number} delta
 * @param {Wall} wall
 * @returns {Wall}
 */
export const integrateWall = (delta, wall) =>
    new Wall(
        wall.a.add(wall.velocity.multiplyScalar(delta)),
        wall.b.add(wall.velocity.multiplyScalar(delta)),
        wall.velocity
    );

/**
 *
 * @param {Number} delta
 * @param {Wall[]} walls
 * @returns {Wall[]}
 */
export const integrateWalls = (delta, walls) =>
    walls.map(wall => integrateWall(delta, wall));