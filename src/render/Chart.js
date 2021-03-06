import {svgGrid} from './svgGrid';

/**
 *
 * @param selector
 * @param color
 * @returns {function(...[*]=)}
 * @constructor
 */
export const Chart = (selector, color = "#013d3d") => {
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
        ctx.moveTo(...coordsToCanvas(canvas)(data_x, data_y, data_x[0], data_y[0]));
        for(let i = 1; i < data_x.length; i++){
            ctx.lineTo(...coordsToCanvas(canvas)(data_x, data_y, data_x[i], data_y[i]));
        }
        ctx.stroke();

        ctx.fillStyle = "#009332";
        ctx.beginPath();
        ctx.arc(...coordsToCanvas(canvas)(data_x, data_y, data_x[data_x.length - 1], data_y[data_y.length - 1]), 5, 0, 2 * Math.PI, false);
        ctx.fill();

    }, 20);

    return (_data_x, _data_y) => {
        data_x = _data_x;
        data_y = _data_y;
    };
};

const coordsToCanvas = (canvas) => (data_x, data_y, x, y) => [
    convertRange(x, bounds(data_x), [0, canvas.width]),
    canvas.height - convertRange(y, bounds(data_y), [0, canvas.height]),
];

const bounds = data => [Math.min(...data), Math.max(...data)];

function convertRange(value, r1, r2) {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}