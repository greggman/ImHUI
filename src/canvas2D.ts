import {
  e,
} from './utils.js';
import {
  context,
  Node,
  queueUpdate,
  queueUpdateBecausePreviousUsagesMightBeStale,
 } from './core.js'

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

  update() {
    return this.#ctx;
  }
}

export function canvas2D(): CanvasRenderingContext2D {
  const canvasNode = context.getExistingNodeOrRemove<CanvasNode>(CanvasNode);
  return canvasNode.update();
}