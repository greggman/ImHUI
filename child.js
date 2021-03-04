import { Node, Context, context } from './core.js';
export class BasicWrapperNode extends Node {
    constructor() {
        super('div');
        this.end = () => {
            Context.popContext();
        };
        this.#context = new Context(this.elem, this.end);
    }
    #context;
    begin(className) {
        this.setClassName(className);
        Context.pushContext(this.#context);
    }
}
export function beginWrapper(className) {
    const node = context.getExistingNodeOrRemove(BasicWrapperNode);
    node.begin(className);
}
export function endWrapper() {
    context.finish();
}
export function beginChild(id) {
    beginWrapper('child layout-scrollbar');
}
export function endChild() {
    endWrapper();
}
//# sourceMappingURL=child.js.map