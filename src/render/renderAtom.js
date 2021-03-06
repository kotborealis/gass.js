/**
 *
 * @param ctx
 * @param {Atom} atom
 */
import {atomRadius} from '../entities/Atom';

export const renderAtom = (ctx, atom) => {
    ctx.fillStyle = "#f0f0f0";
    ctx.lineWidth = 2;
    ctx.strokeStyle= "#0f0f0f";
    ctx.beginPath();
    ctx.arc(...[...atom.position.coords(), atomRadius, 0, 2 * Math.PI, false]);
    ctx.fill();
    ctx.stroke();

    const move = atom.velocity;
    const m1 = atom.position;
    const m2 = m1.add(move);

    ctx.lineWidth = 1;
    ctx.strokeStyle= "#f00";
    ctx.beginPath();
    ctx.moveTo(...m1.coords());
    ctx.lineTo(...m2.coords());
    ctx.stroke();
}

/**
 *
 * @param ctx
 * @param {Atom[]} atoms
 */
export const renderAtoms = (ctx, atoms) => atoms.map(renderAtom.bind(this, ctx));