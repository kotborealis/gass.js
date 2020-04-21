/**
 *
 * @param ctx
 * @param {Number} delta
 * @param {World} world
 */
const renderWorld = (ctx, delta, world) => {
    renderAtoms(ctx, delta, world.atoms);
    renderWalls(ctx, delta, world.walls);
}