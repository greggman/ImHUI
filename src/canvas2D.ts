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
    super('canvas');
    this.setClassName('fill-space');
    this.#canvasElem = <HTMLCanvasElement>this.elem;
    this.#ctx =this.#canvasElem.getContext('2d');
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