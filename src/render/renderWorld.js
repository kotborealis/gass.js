/**
 *
 * @param ctx
 * @param {World} world
 */
import {renderAtoms} from './renderAtom';
import {renderWalls} from './renderWall';

export const renderWorld = (ctx, world) => {
    renderAtoms(ctx, world.atoms);
    renderWalls(ctx, world.walls);
}