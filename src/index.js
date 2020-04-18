

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

    if(tFirst < 0){
        console.log(firstCollision);
        throw new Error("TFIRST < 0");
    }

    if(tFirst > delta) {
        console.log("tFirst > delta", firstCollision, delta);
        return new World(
            integrateAtoms(delta, world.atoms),
            world.walls
        );
    }

    const delta_ = delta - tFirst - 0.001;
    const collidingAtoms = collisionAtoms(firstCollision);
    const nonCollidingAtoms = world.atoms.filter(atom => !collidingAtoms.includes(atom));

    return new World(
        [
            ...integrateAtoms(tFirst, nonCollidingAtoms),
            ...resolveCollision(firstCollision)
        ],
        world.walls
    );
};



const canvas = document.querySelector('canvas');
const onResize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
onResize();

const width = 400;
const height = 400;

const initialBounds = [
    new Vector(100, 100),
    new Vector(width, height)
];

const atomRadius = 10;

const atomsCountX = 1;
const atomsCountY = 1;

const atoms = [];

for(let i = 0; i < atomsCountX; i++)
    for(let j = 0; j < atomsCountY; j++)
        atoms.push(new Atom(
            new Vector(
                atomRadius*2 + initialBounds[0].x + i * width/(atomRadius*2),
                atomRadius*2 + initialBounds[0].y + j * height/(atomRadius*2)
            ),
            Vector.random(100, 300, 200, 200),
        ));

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

let world = new World(atoms, walls);

document.addEventListener('resize', onResize);

const render = (canvas, world, delta) => {
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

let lastTime = Date.now();
let time = Date.now();

let collisionNormals = [];

const update = () => {
    time = Date.now();
    const delta = (time - lastTime)/1000;
    //const delta = 1/60;
    lastTime = time;
    render(canvas, world, delta);
    collisionNormals = [];
    world = runPhysics(delta, world);
    requestAnimationFrame(update);
};

update();

window.canvas = canvas;