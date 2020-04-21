import {Atom, atomRadius, integrateAtoms} from './Atom';
import {integrateWalls, Wall} from './Wall';
import {collideAtomAtom, collideAtomWall, collisionAtoms, minCollision, resolveCollision} from './Collision';
import {Vector} from '../vector/Vector';

export class World {
    /** @type {Atom[]} **/
    atoms;

    /** @type {Wall[]} **/
    walls;

    /**
     *
     * @param {Atom[]} atoms
     * @param {Wall[]} walls
     */
    constructor(atoms, walls) {
        this.atoms = atoms;
        this.walls = walls;
    }
}

/**
 *
 * @param {Number} delta
 * @param {World} world
 * @returns {World}
 */
export const runPhysics = (delta, world) => {
    if(delta === 0) {
        return world
    }

    const collisions_ = [];

    for(let i = 0; i < world.atoms.length; i++) {
        for(let j = i + 1; j < world.atoms.length; j++)
            collisions_.push(collideAtomAtom(delta, world.atoms[i], world.atoms[j]));

        for(let j = 0; j < world.walls.length; j++)
            collisions_.push(collideAtomWall(delta, world.atoms[i], world.walls[j]));
    }

    const collisions = collisions_.filter(id => id);

    if(!collisions.length) {
        return new World(
            integrateAtoms(delta, world.atoms),
            integrateWalls(delta, world.walls)
        );
    }

    const firstCollision = minCollision(collisions);
    const tFirst = firstCollision.time;

    if(tFirst > delta) {
        return new World(
            integrateAtoms(delta, world.atoms),
            integrateWalls(delta, world.walls)
        );
    }

    let delta_ = Math.max(delta - tFirst - 0.0001, 0);
    const collidingAtoms = collisionAtoms(firstCollision);
    const nonCollidingAtoms = world.atoms.filter(atom => !collidingAtoms.includes(atom));

    return runPhysics(delta_, new World(
        [
            ...integrateAtoms(tFirst, nonCollidingAtoms),
            ...resolveCollision(firstCollision)
        ],
        integrateWalls(tFirst, world.walls)
    ));
};

/**
 *
 * @param {Number} width
 * @param {Number} height
 * @param {Number} atomsCount
 */
export const generateWorld = (width, height, atomsCount) => {
    const initialBounds = [
        new Vector(100, 100),
        new Vector(width - 100, height - 100)
    ];


    const atoms = Array.from(
        {length: atomsCount},
        () => new Atom(
            Vector.random(
                initialBounds[0].x + atomRadius,
                initialBounds[1].x - atomRadius,
                initialBounds[0].y + atomRadius,
                initialBounds[1].y - atomRadius),
            Vector.random(-100, 100, -100, 100)
        )
    );

    const walls = [
        new Wall(
            new Vector(initialBounds[0].x, initialBounds[0].y),
            new Vector(initialBounds[1].x, initialBounds[0].y),
        ),
        new Wall(
            new Vector(initialBounds[1].x, initialBounds[0].y),
            new Vector(initialBounds[1].x, initialBounds[1].y),
        ),
        new Wall(
            new Vector(initialBounds[1].x, initialBounds[1].y),
            new Vector(initialBounds[0].x, initialBounds[1].y),
        ),
        new Wall(
            new Vector(initialBounds[0].x, initialBounds[1].y),
            new Vector(initialBounds[0].x, initialBounds[0].y),
        ),
    ];

    return new World(atoms, walls);
};