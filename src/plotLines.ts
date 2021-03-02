import {
  e,
  resizeCanvasToDisplaySize,
} from './utils.js';
import {
  context,
  Node,
  queueUpdate,
  queueUpdateBecausePreviousUsagesMightBeStale,
 } from './core.js'
import {text} from './text.js';
import { beginWrapper, endWrapper } from './child.js';

class CanvasNode extends Node {
  #canvasElem: HTMLCanvasElement;
  #ctx: CanvasRenderingContext2D;

  constructor() {
    super();
    this.#canvasElem = <HTMLCanvasElement>e('canvas', {className: 'fill-space'});
    this.#ctx =this.#canvasElem.getContext('2d');
    this.elem = this.#canvasElem;
    const resizeObserver = new ResizeObserver(queueUpdate);
    resizeObserver.observe(this.elem);
  }

  get ctx(): CanvasRenderingContext2D {
    return this.#ctx;
  }

  update() {
    resizeCanvasToDisplaySize(this.#canvasElem);
    this.#ctx.clearRect(0, 0, this.#canvasElem.width, this.#canvasElem.height);
  }
}

// TODO: Move
const darkColors = {
  lines: 'white',
}
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

export function plotLines(
    prompt: string,
    points: number[],
    scaleMin?: number,
    scaleMax?: number,
    size?: number[],
) {
  beginWrapper('plot-lines form-line');
    beginWrapper('div');
      const canvasNode = context.getExistingNodeOrRemove<CanvasNode>(CanvasNode);
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
      const {width, height} = ctx.canvas;
      for (let i = 0; i < points.length; ++i) {
        ctx.lineTo(
          i * width / ((points.length - 1) || 1),
          (points[i] - min) * height / range);
      }
      ctx.stroke();
    endWrapper();
    text(prompt);
  endWrapper();
}