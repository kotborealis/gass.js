/**
 *
 * @param ctx
 * @param {Number} delta
 * @param {World} world
 */
import {renderAtoms} from './atom';
import {renderWalls} from './wall';

export const renderWorld = (ctx, delta, world) => {
    renderAtoms(ctx, delta, world.atoms);
    renderWalls(ctx, delta, world.walls);
}