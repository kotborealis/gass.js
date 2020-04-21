import {Vector} from './vector/Vector';
import {Atom, atomRadius} from './entities/Atom';
import {Wall} from './entities/Wall';
import {runPhysics, World} from './entities/World';
import {renderWorld} from './render/world';

const canvas = document.querySelector('canvas');
window.canvas = canvas;

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width;
canvas.height = height;

const initialBounds = [
    new Vector(100, 100),
    new Vector(width - 100, height - 100)
];

const atomsCountX = 10;
const atomsCountY = 10;

const atoms = [];

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

    renderWorld(ctx, delta, world);
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