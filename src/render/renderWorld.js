/**
 *
 * @param ctx
 * @param {Number} delta
 * @param {World} world
 */
import {renderAtoms} from './renderAtom';
import {renderWalls} from './renderWall';

export const renderWorld = (ctx, delta, world) => {
    renderAtoms(ctx, delta, world.atoms);
    renderWalls(ctx, delta, world.walls);
}