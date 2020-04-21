import {generateWorld, runPhysics, World} from './entities/World';
import {renderWorld} from './render/renderWorld';
import {Wall} from './entities/Wall';
import {Vector} from './vector/Vector';

const canvas = document.querySelector('canvas');
window.canvas = canvas;

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width;
canvas.height = height;

let world = generateWorld(width, height, 150);

const moveWall = {
    left: false,
    right: false
};

document.addEventListener('keydown', (e) => {
    if(e.code === 'ArrowLeft') {
        moveWall.left = true;
        moveWall.right = false;
    }
    else if(e.code === 'ArrowRight') {
        moveWall.left = false;
        moveWall.right = true;
    }
});
document.addEventListener('keyup', (e) => {
    if(e.code === 'ArrowLeft') {
        moveWall.left = false;
    }
    else if(e.code === 'ArrowRight') {
        moveWall.right = false;
    }
});

const render = (canvas, world, delta) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderWorld(ctx, delta, world);
};

const update = (delta = 1/60) => {
    const timeStart = Date.now();

    if(moveWall.left)
        world.walls[1] = new Wall(world.walls[1].a, world.walls[1].b, new Vector(-100, 0));
    else if(moveWall.right)
        world.walls[1] = new Wall(world.walls[1].a, world.walls[1].b, new Vector(100, 0));
    else
        world.walls[1] = new Wall(world.walls[1].a, world.walls[1].b, Vector.zero());

    render(canvas, world, delta);
    world = runPhysics(delta, world);

    const timeEnd = Date.now();
    const deltaActual = timeEnd - timeStart;

    if(deltaActual >= delta)
        requestAnimationFrame(update.bind(this, delta));
    else
        setTimeout(update.bind(this, delta), delta * 1000);
};

update();