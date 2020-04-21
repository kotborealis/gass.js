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

const world = {
    current: generateWorld(width, height, 100)
};

const render = (canvas, world) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderWorld(ctx, world.current);
    requestAnimationFrame(render.bind(this, canvas, world));
};

render(canvas, world);

const update = (delta = 1/60) => {
    const timeStart = Date.now();

    const walls = world.current.walls;

    if(moveWall.left)
        walls[1] = new Wall(walls[1].a, walls[1].b, new Vector(-100, 0));
    else if(moveWall.right)
        walls[1] = new Wall(walls[1].a, walls[1].b, new Vector(100, 0));
    else
        walls[1] = new Wall(walls[1].a, walls[1].b, Vector.zero());

    console.log("RUN PHYS");
    runPhysics(delta, world.current, (world_) => {
        world.current = world_;
        const timeEnd = Date.now();
        const deltaActual = timeEnd - timeStart;
        if(deltaActual >= delta)
            requestAnimationFrame(update.bind(this, delta));
        else
            setTimeout(update.bind(this, delta), delta * 1000);
    });
};

update();