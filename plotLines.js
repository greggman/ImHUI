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
import { e } from './utils.js';
import { context, Node, } from './core.js';
import { text } from './text.js';
import { beginWrapper, endWrapper } from './child.js';
function resizeCanvasToDisplaySize(canvas) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = width !== canvas.width || height !== canvas.height;
    if (needResize) {
        canvas.width = width;
        canvas.height = height;
    }
    return needResize;
}
class CanvasNode extends Node {
    constructor() {
        super();
        _canvasElem.set(this, void 0);
        _ctx.set(this, void 0);
        __classPrivateFieldSet(this, _canvasElem, e('canvas', { className: 'fill-space' }));
        __classPrivateFieldSet(this, _ctx, __classPrivateFieldGet(this, _canvasElem).getContext('2d'));
        this.elem = __classPrivateFieldGet(this, _canvasElem);
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
const darkColors = {
    lines: 'white',
};
const lightColors = {
    lines: 'black',
};
const darkMatcher = window.matchMedia("(prefers-color-scheme: dark)");
const isDarkMode = darkMatcher.matches;
const colors = isDarkMode ? darkColors : lightColors;
export function plotLines(prompt, points) {
    beginWrapper('plot-lines form-line');
    beginWrapper('div');
    const canvasNode = context.getExistingNodeOrRemove(CanvasNode);
    canvasNode.update();
    const ctx = canvasNode.ctx;
    ctx.strokeStyle = colors.lines;
    let min = points[0];
    let max = min;
    for (let i = 1; i < points.length; ++i) {
        const x = points[i];
        min = Math.min(min, x);
        max = Math.max(max, x);
    }
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