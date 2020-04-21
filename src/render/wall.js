/**
 *
 * @param ctx
 * @param {Number} delta
 * @param {Wall} wall
 */
const renderWall = (ctx, delta, wall) => {
    ctx.lineWidth = 1;
    ctx.strokeStyle= "#000";
    ctx.beginPath();
    ctx.moveTo(...wall.a.coords());
    ctx.lineTo(...wall.b.coords());
    ctx.stroke();
}

/**
 *
 * @param ctx
 * @param {Number} delta
 * @param {Wall[]} walls
 */
const renderWalls = (ctx, delta, walls) => walls.map(renderWall.bind(this, ctx, delta));