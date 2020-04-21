

class World {
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
const runPhysics = (delta, world) => {
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
            world.walls
        );
    }

    const firstCollision = minCollision(collisions);
    const tFirst = firstCollision.time;

    if(tFirst > delta) {
        return new World(
            integrateAtoms(delta, world.atoms),
            world.walls
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
        world.walls
    ));
};