import {e} from './utils.js';
import {
  context,
  GetSet,
  Node,
  queueUpdate,
  queueUpdateBecausePreviousUsagesMightBeStale,
 } from './core.js'
import {text} from './text.js';
import { beginWrapper, endWrapper } from './child.js';

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean {
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
  #canvasElem: HTMLCanvasElement;
  #ctx: CanvasRenderingContext2D;

  constructor() {
    super();
    this.#canvasElem = <HTMLCanvasElement>e('canvas', {className: 'fill-space'});
    this.#ctx =this.#canvasElem.getContext('2d');
    this.elem = this.#canvasElem;
  }

  get ctx(): CanvasRenderingContext2D {
    return this.#ctx;
  }

  update() {
    resizeCanvasToDisplaySize(this.#canvasElem);
    this.#ctx.clearRect(0, 0, this.#canvasElem.width, this.#canvasElem.height);
  }
}

const darkColors = {
  lines: 'white',
}
const lightColors = {
  lines: 'black',
};
const darkMatcher = window.matchMedia("(prefers-color-scheme: dark)");
const isDarkMode = darkMatcher.matches;
const colors = isDarkMode ? darkColors : lightColors;


export function plotLines(prompt: string, points: number[]) {
  beginWrapper('plot-lines form-line');
    beginWrapper('div');
      const canvasNode = context.getExistingNodeOrRemove<CanvasNode>(CanvasNode);
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