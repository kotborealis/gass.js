/**
 *
 * @param ctx
 * @param {World} world
 */
import {renderAtoms} from './renderAtom';
import {renderWalls} from './renderWall';
import {svgGrid} from './svgGrid';

export const renderWorld = (ctx, world) => {
    if(svgGrid.current)
        ctx.drawImage(svgGrid.current, 0, 0);

    renderAtoms(ctx, world.atoms);
    renderWalls(ctx, world.walls);
}