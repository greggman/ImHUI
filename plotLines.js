var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _canvasElem, _ctx;
import { e, resizeCanvasToDisplaySize, } from './utils.js';
import { context, Node, queueUpdate, } from './core.js';
import { text } from './text.js';
import { beginWrapper, endWrapper } from './child.js';
class CanvasNode extends Node {
    constructor() {
        super();
        _canvasElem.set(this, void 0);
        _ctx.set(this, void 0);
        __classPrivateFieldSet(this, _canvasElem, e('canvas', { className: 'fill-space' }));
        __classPrivateFieldSet(this, _ctx, __classPrivateFieldGet(this, _canvasElem).getContext('2d'));
        this.elem = __classPrivateFieldGet(this, _canvasElem);
        const resizeObserver = new ResizeObserver(queueUpdate);
        resizeObserver.observe(this.elem);
    }
    get ctx() {
        return __classPrivateFieldGet(this, _ctx);
    }
    update() {
        resizeCanvasToDisplaySize(__classPrivateFieldGet(this, _canvasElem));
        __classPrivateFieldGet(this, _ctx).clearRect(0, 0, __classPrivateFieldGet(this, _canvasElem).width, __classPrivateFieldGet(this, _canvasElem).height);
    }
}
_canvasElem = new WeakMap(), _ctx = new WeakMap();
// TODO: Move
const darkColors = {
    lines: 'white',
};
const lightColors = {
    lines: 'black',
};
const darkMatcher = window.matchMedia("(prefers-color-scheme: dark)");
const isDarkMode = darkMatcher.matches;
let colors = isDarkMode ? darkColors : lightColors;
darkMatcher.addEventListener('change', () => {
    colors = isDarkMode ? darkColors : lightColors;
    queueUpdate();
});
export function plotLines(prompt, points, scaleMin, scaleMax, size) {
    beginWrapper('plot-lines form-line');
    beginWrapper('div');
    const canvasNode = context.getExistingNodeOrRemove(CanvasNode);
    canvasNode.update();
    const ctx = canvasNode.ctx;
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
    const { width, height } = ctx.canvas;
    for (let i = 0; i < points.length; ++i) {
        ctx.lineTo(i * width / ((points.length - 1) || 1), (points[i] - min) * height / range);
    }
    ctx.stroke();
    endWrapper();
    text(prompt);
    endWrapper();
}
//# sourceMappingURL=plotLines.js.map