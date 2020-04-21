export class Atom {
    /** @type {Vector} **/
    position;

    /** @type {Vector} **/
    velocity;

    /**
     *
     * @param {Vector} position
     * @param {Vector} velocity
     */
    constructor(position, velocity) {
        this.position = position.copy();
        this.velocity = velocity.copy();
    }
}

export const atomRadius = 10;

/**
 *
 * @param {Number} delta
 * @param {Atom} atom
 * @returns {Atom}
 */
export const integrateAtom = (delta, atom) =>
    new Atom(atom.position.add(atom.velocity.multiplyScalar(delta)), atom.velocity);

/**
 *
 * @param {Number} delta
 * @param {Atom[]} atoms
 * @returns {Atom[]}
 */
export const integrateAtoms = (delta, atoms) =>
    atoms.map(atom => integrateAtom(delta, atom));