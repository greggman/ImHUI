import { canvas2D } from './canvas2D.js';
import { beginWrapper, endWrapper } from './child.js';
import { getColors } from './colors.js';
import { text } from './text.js';
import { resizeCanvasToDisplaySize } from './utils.js';
export function plotLines(prompt, points, scaleMin, scaleMax, size) {
    beginWrapper('plot-lines form-line');
    beginWrapper('div');
    const ctx = canvas2D();
    resizeCanvasToDisplaySize(ctx.canvas);
    const { width, height } = ctx.canvas;
    const colors = getColors();
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = colors.lines;
    let min = points[0];
    let max = min;
    if (scaleMin === undefined || scaleMax === undefined) {
        for (let i = 1; i < points.length; ++i) {
            const x = points[i];
            min = Math.min(min, x);
            max = Math.max(max, x);
        }
    }
    min = scaleMin === undefined ? min : scaleMin;
    max = scaleMax === undefined ? max : scaleMax;
    ctx.beginPath();
    const range = max - min;
    for (let i = 0; i < points.length; ++i) {
        ctx.lineTo(i * width / ((points.length - 1) || 1), (points[i] - min) * height / range);
    }
    ctx.stroke();
    endWrapper();
    text(prompt);
    endWrapper();
}
//# sourceMappingURL=plotLines.js.map