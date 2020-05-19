import {generateWorld, runPhysics} from './entities/World';
import {renderWorld} from './render/renderWorld';
import {Wall} from './entities/Wall';
import {Vector} from './vector/Vector';
import {Chart} from './render/Chart';

const canvas = document.querySelector('canvas');
window.canvas = canvas;

const {width, height} = document.querySelector('.simulation').getBoundingClientRect();

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

const integralParamsHistory = {
    /** @type {Number[]} **/
    pressures: [],

    /** @type {Number[]} **/
    volumes: [],

    /** @type {Number[]} **/
    temperatures: [],
};

const charts = {
    pressure_volume: Chart('.pressure-volume-chart canvas'),
    pressure_temperature: Chart('.pressure-temperature-chart canvas'),
    volume_temperature: Chart('.volume-temperature-chart canvas')
};

const render = (canvas, world) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderWorld(ctx, world.current);
    requestAnimationFrame(render.bind(this, canvas, world));
};

render(canvas, world);

const updateIntegralParams = (container, world) => {
    const {walls, atoms} = world.current;

    const volume = (walls[1].a.x - walls[0].a.x) * (walls[1].b.y - walls[1].a.y);
    container.querySelector('.volume > .value').innerHTML = volume.toString();

    const Ek_m = atoms
        .map(({velocity}) => velocity.lengthSquared())
        .reduce((a, b) => a + b)/atoms.length/2;
    const pressure = 2/3 * (atoms.length / volume) * Ek_m;
    container.querySelector('.pressure > .value').innerHTML = pressure.toString();

    const temperature = Ek_m / (3/2) / (1.38 * 10e-23);
    container.querySelector('.temperature > .value').innerHTML = temperature.toString();

    integralParamsHistory.volumes = [...integralParamsHistory.volumes.slice(-200), volume];
    integralParamsHistory.temperatures = [...integralParamsHistory.temperatures.slice(-200), temperature];
    integralParamsHistory.pressures = [...integralParamsHistory.pressures.slice(-200), pressure];

    const {pressures, temperatures, volumes} = integralParamsHistory;
    const {pressure_volume, pressure_temperature, volume_temperature} = charts;

    pressure_volume(volumes, pressures);
    pressure_temperature(temperatures, pressures);
    volume_temperature(temperatures, volumes);

    setTimeout(updateIntegralParams.bind(this, container, world), 500);
}

updateIntegralParams(document.querySelector('.integral-params'), world);

const update = (delta = 1/60) => {
    const timeStart = Date.now();

    const walls = world.current.walls;

    if(moveWall.left)
        walls[1] = new Wall(walls[1].a, walls[1].b, new Vector(-100, 0));
    else if(moveWall.right)
        walls[1] = new Wall(walls[1].a, walls[1].b, new Vector(100, 0));
    else
        walls[1] = new Wall(walls[1].a, walls[1].b, Vector.zero());

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