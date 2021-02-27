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
var _currentElem, _currentParent, _currentChildrenByKey, _currentUsedKeys, _children, _currentKey, _finishFn, _context;
export class Node {
    getAs(ctor) {
        return this instanceof ctor ? (this) : undefined;
    }
}
;
const stack = [];
const noop = () => { };
export class Context {
    constructor(elem, finishFn = noop) {
        _currentElem.set(this, void 0);
        _currentParent.set(this, void 0);
        _currentChildrenByKey.set(this, new Map());
        _currentUsedKeys.set(this, new Set());
        _children.set(this, []);
        _currentKey.set(this, 0);
        _finishFn.set(this, void 0);
        __classPrivateFieldSet(this, _currentElem, elem);
        __classPrivateFieldSet(this, _finishFn, finishFn);
    }
    getExistingNodeOrRemove(ctor, ...args) {
        var _a;
        const key = (__classPrivateFieldSet(this, _currentKey, (_a = +__classPrivateFieldGet(this, _currentKey)) + 1), _a).toString();
        let node = __classPrivateFieldGet(this, _currentChildrenByKey).get(key);
        let typedNode = node?.getAs(ctor);
        if (!typedNode) {
            if (node) {
                node.elem.remove();
            }
            typedNode = new ctor(...args);
            __classPrivateFieldGet(this, _currentElem).appendChild(typedNode.elem);
            __classPrivateFieldGet(this, _currentChildrenByKey).set(key, typedNode);
        }
        __classPrivateFieldGet(this, _currentUsedKeys).add(key);
        return typedNode;
    }
    start() {
        __classPrivateFieldSet(this, _currentKey, 0);
    }
    finish() {
        // TODO: remove unused
        const unused = new Set();
        __classPrivateFieldGet(this, _finishFn).call(this);
    }
    static setCurrentContext(newContext) {
        context = newContext;
    }
}
_currentElem = new WeakMap(), _currentParent = new WeakMap(), _currentChildrenByKey = new WeakMap(), _currentUsedKeys = new WeakMap(), _children = new WeakMap(), _currentKey = new WeakMap(), _finishFn = new WeakMap();
export let context;
let currentRenderUIFunc;
let updateId;
function update() {
    updateId = undefined;
    currentRenderUIFunc();
}
export function queueUpdate() {
    if (!updateId) {
        updateId = requestAnimationFrame(update);
    }
}
export function queueUpdateBecausePreviousUsagesMightBeStale() {
    queueUpdate();
}
class RootNode extends Node {
    constructor(elem) {
        super();
        _context.set(this, void 0);
        __classPrivateFieldSet(this, _context, new Context(elem));
    }
    // FIX!
    setAsCurrent() {
        context = __classPrivateFieldGet(this, _context);
    }
}
_context = new WeakMap();
export function setup(elem, renderUIFunc) {
    currentRenderUIFunc = renderUIFunc;
    const node = new RootNode(elem);
    // FIX!
    node.setAsCurrent();
    queueUpdate();
    const resizeObserver = new ResizeObserver(queueUpdate);
    resizeObserver.observe(elem);
}
export function start() {
    context.start();
}
export function finish() {
    context.finish();
}
//# sourceMappingURL=core.js.map