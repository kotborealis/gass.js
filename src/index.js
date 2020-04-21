const canvas = document.querySelector('canvas');

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width;
canvas.height = height;

const initialBounds = [
    new Vector(100, 100),
    new Vector(width - 100, height - 100)
];

const atomRadius = 10;
const atomsCountX = 10;
const atomsCountY = 10;

const atoms = [
    //new Atom(
    //    new Vector(
    //        400,
    //        400
    //    ),
    //    new Vector(-472.9904476582339, -593.5051018316937)
    //)
];

for(let i = 0; i < atomsCountX; i++)
    for(let j = 0; j < atomsCountY; j++)
        atoms.push(new Atom(
            new Vector(
                100 + atomRadius*2 + initialBounds[0].x + i * width/(atomRadius*2),
                100 + atomRadius*2 + initialBounds[0].y + j * height/(atomRadius*2)
            ),
            Vector.random(-1000, 1000, -1000, 1000),
        ));

const walls = (bounds = initialBounds) => [
    new Wall(
        new Vector(bounds[0].x, bounds[0].y),
        new Vector(bounds[1].x, bounds[0].y),
    ),
    new Wall(
        new Vector(bounds[1].x, bounds[0].y),
        new Vector(bounds[1].x, bounds[1].y),
    ),
    new Wall(
        new Vector(bounds[1].x, bounds[1].y),
        new Vector(bounds[0].x, bounds[1].y),
    ),
    new Wall(
        new Vector(bounds[0].x, bounds[1].y),
        new Vector(bounds[0].x, bounds[0].y),
    ),
];

let world = new World(atoms, walls());

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

        //if(atom.position.y < 110) {
        //    console.log(atom);
        //    throw new Error;
        //}

        const move = atom.velocity.multiplyScalar(delta);
        const m1 = atom.position.add(move.normalize().multiplyScalar(atomRadius));
        const m2 = m1.add(move);

        ctx.lineWidth = 1;
        ctx.strokeStyle= "#f00";
        ctx.beginPath();
        ctx.moveTo(...m1.coords());
        ctx.lineTo(...m2.coords());
        ctx.stroke();
    });

    world.walls.forEach(wall => {
        ctx.lineWidth = 1;
        ctx.strokeStyle= "#000";
        ctx.beginPath();
        ctx.moveTo(...wall.a.coords());
        ctx.lineTo(...wall.b.coords());
        ctx.stroke();
    });
};

let lastTime = Date.now();
let time = Date.now();


const update = () => {
    time = Date.now();
    //const delta = (time - lastTime)/1000;
    const delta = 1/60;
    lastTime = time;

    render(canvas, world, delta);
    world = runPhysics(delta, world);
    //requestAnimationFrame(update);
    setTimeout(update, delta * 1000);
};

update();

//document.addEventListener('keypress', update);