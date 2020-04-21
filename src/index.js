import {generateWorld, runPhysics, World} from './entities/World';
import {renderWorld} from './render/renderWorld';

const canvas = document.querySelector('canvas');
window.canvas = canvas;

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width;
canvas.height = height;

let world = generateWorld(width, height, 100);

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