const atomRadius = 10;

class Atom {
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

class Collision {
    /** @type {Atom|Wall} **/
    a;

    /** @type {Atom|Wall} **/
    b;

    /** @type {Number} **/
    time;

    /** @type {Vector} **/
    normal;

    /**
     *
     * @param entityA
     * @param entityB
     * @param {Number} time
     * @param {Vector} normal
     */
    constructor(entityA, entityB, time, normal) {
        this.a = entityA;
        this.b = entityB;
        this.time = time;
        this.normal = normal.copy();
    }
}

/**
 *
 * @param {Collision[]} collisions
 * @returns {Collision}
 */
const minCollision = (collisions = []) =>
    collisions.reduce((min, current) => current.time < min.time ? current : min);

/**
 *
 * @param {Collision} collision
 * @returns {Atom[]}
 */
const collisionAtoms = (collision) => [
    collision.a instanceof Atom ? collision.a : null,
    collision.b instanceof Atom ? collision.b : null
].filter(id => id);

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
 * @param {Atom} lh
 * @param {Atom} rh
 * @returns {Collision|null}
 */
const collideAtomAtom = (delta, lh, rh) => {
    const move = lh.velocity.sub(rh.velocity).multiplyScalar(delta);
    const dist = lh.position.distance(rh.position) - atomRadius * 2;

    if(move.length() < dist) return null;

    const moveNormalized = move.normalize();
    const center = rh.position.sub(lh.position);
    const d = moveNormalized.dot(center);

    if(d <= 0) return null;

    const f = center.length() ** 2 - d ** 2;

    if(f >= (atomRadius * 2) ** 2) return null;

    const t = (atomRadius * 2) ** 2 - f;

    if(t < 0) return null;

    const distUntilCollision = d - Math.sqrt(t);
    const time = delta * (distUntilCollision / move.length());
    const normal = center.normalize();

    return new Collision(
        lh,
        rh,
        time,
        normal
    );
};

/**
 *
 * @param {Number} delta
 * @param {Atom} atom
 * @param {Wall} wall
 * @returns {Collision|null}
 */
const collideAtomWall = (delta, atom, wall) => {
    const move = atom.velocity.multiplyScalar(delta);
    const moveNormalized = move.normalize();
    const p1 = wall.a.sub(atom.position).sub(move);
    const p2 = wall.b.sub(atom.position).sub(move);
    const k = p2.sub(p1);
    const a = k.x ** 2 + k.y ** 2;
    const b = 2 * (k.x * p1.x + k.y * p1.y);
    const c = p1.x ** 2 + p1.y ** 2 - atomRadius ** 2;
    const d = b ** 2 - 4 * a * c;

    if(d < 0) return null;

    const u1 = (-b + Math.sqrt(d)) / (2 * a);
    const u2 = (-b - Math.sqrt(d)) / (2 * a);
    const u = (u1 + u2) / 2;
    const cp = wall.a.add(k.multiplyScalar(u));
    const center = cp.sub(atom.position);
    const dd = moveNormalized.dot(center);

    if(dd <= 0) return null;

    const normal = center.normalize();
    const distUntilCollision = center.sub(move).length() - atomRadius;
    const time = delta * (distUntilCollision / move.length());

    return new Collision(
        atom,
        wall,
        time,
        normal
    );
}

/**
 *
 * @param {Number} delta
 * @param {Atom} atom
 * @returns {Atom}
 */
const integrateAtom = (delta, atom) =>
    new Atom(atom.position.add(atom.velocity.multiplyScalar(delta)), atom.velocity);

/**
 *
 * @param {Number} delta
 * @param {Atom[]} atoms
 * @returns {Atom[]}
 */
const integrateAtoms = (delta, atoms) =>
    atoms.map(atom => integrateAtom(delta, atom));

/**
 *
 * @param {Number} delta
 * @param {World} world
 * @returns {World}
 */
const runPhysics = (delta, world) => {
    if(delta === 0) return world;

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

    const delta_ = delta - tFirst;
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

/**
 *
 * @param {Collision} collision
 * @returns {Atom[]}
 */
const resolveCollision = (collision) => {
    if(collisionAtoms(collision).length === 2) {
        const delta = collision.time;
        const a = integrateAtom(delta, collision.a);
        const b = integrateAtom(delta, collision.b);
        const v1 = a.velocity;
        const v2 = b.velocity;
        const n = collision.normal;
        const separatingVelocity = -v1.sub(v2).dot(n);

        if(separatingVelocity > 0) return [a, b];

        const a1 = v1.dot(n);
        const a2 = v2.dot(n);
        const p = a1 - a2;

        a.velocity = v1.sub(n.multiplyScalar(p));
        b.velocity = v2.add(n.multiplyScalar(p));

        return [a, b];
    }
    if(collisionAtoms(collision).length === 1) {
        const delta = collision.time;
        const a = integrateAtom(delta, collision.a);
        const v1 = a.velocity;
        const n = collision.normal;
        const separatingVelocity = -v1.dot(n);

        if(separatingVelocity > 0) return [a];

        const nn = n.dot(n);
        a.velocity = v1.sub(n.multiplyScalar(-2 * (separatingVelocity / nn)));

        return [a];
    }
    return [];
};

const atoms = [
    new Atom(
        new Vector(200, 200),
        new Vector(20, 10)
    ),
    new Atom(
        new Vector(250, 250),
        new Vector(-10, -25)
    ),
];

const walls = [
    new Wall(
        new Vector(100, 100),
        new Vector(500, 100),
    ),
    new Wall(
        new Vector(500, 100),
        new Vector(500, 500),
    ),
    new Wall(
        new Vector(500, 500),
        new Vector(100, 500),
    ),
    new Wall(
        new Vector(100, 500),
        new Vector(100, 100),
    ),
];

let world = new World(atoms, walls);

const canvas = document.querySelector('canvas');

const render = (canvas, world) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    world.atoms.forEach(atom => {
        ctx.fillStyle = "#f0f0f0";
        ctx.lineWidth = 2;
        ctx.strokeStyle= "#0f0f0f";
        ctx.beginPath();
        ctx.arc(...[...atom.position.coords(), atomRadius, 0, 2 * Math.PI, false]);
        ctx.fill();
        ctx.stroke();
    });

    world.walls.forEach(wall => {
        ctx.lineWidth = 5;
        ctx.strokeStyle= "#0f0f0f";
        ctx.beginPath();
        ctx.moveTo(...wall.a.coords());
        ctx.lineTo(...wall.b.coords());
        ctx.stroke();
    });
};

const update = () => {
    render(canvas, world);
    world = runPhysics(1/60, world);
    window.world = world;
    requestAnimationFrame(update);
};

window.update = update;

update();