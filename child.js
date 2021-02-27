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
var _context, _previousContext;
import { e } from './utils.js';
import { Node, Context, context } from './core.js';
export class BasicWrapperNode extends Node {
    constructor(className) {
        super();
        _context.set(this, void 0);
        _previousContext.set(this, void 0);
        this.end = () => {
            Context.setCurrentContext(__classPrivateFieldGet(this, _previousContext));
        };
        this.elem = e('div', { className });
        __classPrivateFieldSet(this, _context, new Context(this.elem, this.end));
    }
    begin() {
        __classPrivateFieldSet(this, _previousContext, context);
        Context.setCurrentContext(__classPrivateFieldGet(this, _context));
        context.start();
    }
}
_context = new WeakMap(), _previousContext = new WeakMap();
export function beginWrapper(className) {
    const node = context.getExistingNodeOrRemove(BasicWrapperNode, className);
    node.begin();
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