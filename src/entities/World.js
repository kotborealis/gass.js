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
 * @param callback
 */
export const runPhysics = (delta, world, resolve) => setTimeout(() => {
    if(delta === 0) {
        return resolve(world);
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
        return resolve(new World(
            integrateAtoms(delta, world.atoms),
            integrateWalls(delta, world.walls)
        ));
    }

    const firstCollision = minCollision(collisions);
    const tFirst = firstCollision.time;

    if(tFirst > delta) {
        return resolve(new World(
            integrateAtoms(delta, world.atoms),
            integrateWalls(delta, world.walls)
        ));
    }

    let delta_ = Math.max(delta - tFirst - 0.001, 0);
    const collidingAtoms = collisionAtoms(firstCollision);
    const nonCollidingAtoms = world.atoms.filter(atom => !collidingAtoms.includes(atom));

    const world_ = new World(
        [
            ...integrateAtoms(tFirst, nonCollidingAtoms),
            ...resolveCollision(firstCollision)
        ],
        integrateWalls(tFirst, world.walls)
    );
    setTimeout(() => runPhysics(delta_, world_, resolve), 0);
}, 0);

/**
 *
 * @param {Number} width
 * @param {Number} height
 * @param {Number} atomsCount
 */
export const generateWorld = (width, height, atomsCount) => {
    const initialBounds = [
        new Vector(10, 10),
        new Vector(width - 10, height - 10)
    ];


    const atoms = Array.from(
        {length: atomsCount},
        () => new Atom(
            Vector.random(
                initialBounds[0].x + atomRadius*5,
                initialBounds[1].x - atomRadius*5,
                initialBounds[0].y + atomRadius*5,
                initialBounds[1].y - atomRadius*5),
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
            //new Vector(-100, 0)
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