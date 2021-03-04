import { context, Node, queueUpdate, } from './core.js';
class CanvasNode extends Node {
    constructor() {
        super('canvas');
        this.setClassName('fill-space');
        this.#canvasElem = this.elem;
        this.#ctx = this.#canvasElem.getContext('2d');
        const resizeObserver = new ResizeObserver(queueUpdate);
        resizeObserver.observe(this.elem);
    }
    #canvasElem;
    #ctx;
    update() {
        return this.#ctx;
    }
}
export function canvas2D() {
    const canvasNode = context.getExistingNodeOrRemove(CanvasNode);
    return canvasNode.update();
}
//# sourceMappingURL=canvas2D.js.map