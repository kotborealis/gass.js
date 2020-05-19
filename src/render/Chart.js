import {svgGrid} from './svgGrid';
import {Vector} from '../vector/Vector';

/**
 *
 * @param selector
 * @param color
 * @returns {function(...[*]=)}
 * @constructor
 */
export const Chart = (selector, color="#013d3d") => {
    const canvas = document.querySelector(selector);

    let data_x = [], data_y = [];

    setInterval(() => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if(svgGrid)
            ctx.drawImage(svgGrid.current, 0, 0);

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        const x = convertRange(data_x[0], bounds(data_x), [0, canvas.width]);
        const y = canvas.height - convertRange(data_y[0], bounds(data_y), [0, canvas.height]);
        ctx.moveTo(x, y);
        for(let i = 1; i < data_x.length; i++) {
            const x = convertRange(data_x[i], bounds(data_x), [0, canvas.width]);
            const y = canvas.height - convertRange(data_y[i], bounds(data_y), [0, canvas.height]);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }, 500);

    return (_data_x, _data_y) => {
        data_x = _data_x;
        data_y = _data_y;
    };
};

const bounds = data => [Math.min(...data), Math.max(...data)];

function convertRange( value, r1, r2 ) {
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}