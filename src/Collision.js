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
    const ctx = canvas.getContext('2d');

    const move = atom.velocity.sub(wall.velocity).multiplyScalar(delta);
    const m1 = atom.position.copy();
    const m2 = m1.add(move);

    const w1 = wall.a;
    const w2 = wall.b;

    //https://ericleong.me/research/circle-line/#moving-circle-and-static-line-segment

    let a = lineIntersection(w1, w2, m1, m2);

    const p1 = closestPointOnLine(w1, w2, atom.position.add(move));

    if(!a && atom.position.add(move).distance(p1) > atomRadius) {
        return null;
    }

    if(!a) a = p1;

    ctx.fillStyle = "#ff0";
    ctx.lineWidth = 2;
    ctx.strokeStyle= "#ff0";
    ctx.beginPath();
    ctx.arc(...[...p1.coords(), 5, 0, 2 * Math.PI, false]);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#f0f";
    ctx.lineWidth = 2;
    ctx.strokeStyle= "#f0f";
    ctx.beginPath();
    ctx.arc(...[...a.coords(), 5, 0, 2 * Math.PI, false]);
    ctx.fill();
    ctx.stroke();

    const p2 = a.sub(
        atom.velocity
            .multiplyScalar(atomRadius)
            .multiplyScalar(a.multiplyVector(atom.position).length())
            .divideScalar(atom.velocity.length())
            .divideScalar(p1.multiplyVector(atom.position).length())
    );

    const pC = closestPointOnLine(w1, w2, p2);

    const time = delta / Math.abs(move.length() - a.sub(atom.position.add(move)).length());

    //const normal = pC.sub(atom.position.add(move)).normalize().multiplyScalar(1);
    const p3 = p2.add(p1).sub(pC);
    const normal = atom.velocity.multiplyScalar(-1).normalize();

    return new Collision(
        atom,
        wall,
        time,
        normal
    );
};

/**
 *
 * @param {Collision} collision
 * @returns {Atom[]}
 */
const resolveCollision = (collision) => {
    if(collisionAtoms(collision).length === 2){
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
    if(collisionAtoms(collision).length === 1){
        const delta = collision.time;
        const a = integrateAtom(delta, collision.a);
        const b = integrateWall(delta, collision.b);

        a.velocity = collision.normal.multiplyScalar(a.velocity.add(b.velocity).length());

        return [a];
    }
    return [];
};