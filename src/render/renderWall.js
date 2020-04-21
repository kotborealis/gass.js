/**
 *
 * @param ctx
 * @param {Wall} wall
 */
export const renderWall = (ctx, wall) => {
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
 * @param {Wall[]} walls
 */
export const renderWalls = (ctx, walls) => walls.map(renderWall.bind(this, ctx));