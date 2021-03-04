export class Node {
    constructor(type) {
        if (typeof type === 'string') {
            this.elem = document.createElement(type);
        }
        else {
            this.elem = type;
        }
    }
    #className;
    getAs(ctor) {
        return this instanceof ctor ? (this) : undefined;
    }
    setClassName(className) {
        if (this.#className !== className) {
            this.#className = className;
            this.elem.className = className;
        }
    }
    setParent(parent) {
        if (parent) {
            parent.appendChild(this.elem);
        }
        else {
            this.remove();
        }
    }
    remove() {
        this.elem.remove();
    }
}
;
const noop = () => { };
const contextStack = [];
export class Context {
    constructor(elem, finishFn = noop) {
        this.#currentChildrenByKey = new Map();
        this.#currentUsedKeys = new Set();
        this.#currentKey = 0;
        this.#currentElem = elem;
        this.#finishFn = finishFn;
    }
    #currentElem;
    #currentChildrenByKey;
    #currentUsedKeys;
    #currentKey;
    #finishFn;
    getExistingNodeOrRemove(ctor, ...args) {
        const key = (this.#currentKey++).toString();
        let node = this.#currentChildrenByKey.get(key);
        let typedNode = node?.getAs(ctor);
        if (!typedNode) {
            if (node) {
                node.remove();
            }
            typedNode = new ctor(...args);
            typedNode.setParent(this.#currentElem);
            this.#currentChildrenByKey.set(key, typedNode);
        }
        this.#currentUsedKeys.add(key);
        return typedNode;
    }
    start() {
        this.#currentKey = 0;
    }
    finish() {
        for (const [key, node] of this.#currentChildrenByKey.entries()) {
            if (this.#currentUsedKeys.has(key)) {
                // clear for next pass
                this.#currentUsedKeys.delete(key);
            }
            else {
                node.remove();
                this.#currentChildrenByKey.delete(key);
            }
        }
        this.#finishFn();
    }
    static pushContext(newContext) {
        contextStack.push(context);
        context = newContext;
        context.start();
    }
    static popContext() {
        context = contextStack.pop();
    }
}
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
        super(elem);
        this.#context = new Context(elem);
    }
    #context;
    // FIX!
    setAsCurrent() {
        context = this.#context;
    }
    // FIX!
    isCurrent() {
        return context === this.#context;
    }
}
let root;
export function setup(elem, renderUIFunc) {
    currentRenderUIFunc = renderUIFunc;
    root = new RootNode(elem);
    queueUpdate();
    const resizeObserver = new ResizeObserver(queueUpdate);
    resizeObserver.observe(elem);
}
export function start() {
    // FIX!
    if (context) {
        throw new Error('context should not be set on start');
    }
    root.setAsCurrent();
    context.start();
}
export function finish() {
    context.finish();
    if (!root.isCurrent()) {
        throw new Error('not root context at finish. Are you missing an ImMUI.end or endWrapper, etc...?');
    }
    context = null;
}
function copyChanges(src, shadow, dst) {
    for (const [k, v] of Object.entries(src)) {
        if (k !== 'style') {
            if (shadow[k] !== v) {
                shadow[k] = v;
                dst[k] = v;
            }
        }
    }
}
class ElementNode extends Node {
    constructor(type) {
        super(type);
        this.#attrs = {};
        this.#style = {};
    }
    #text;
    #attrs;
    #style;
    update(attrs) {
        if (attrs) {
            copyChanges(attrs, this.#attrs, this.elem);
            const { style } = attrs;
            if (style) {
                copyChanges(style, this.#style, this.elem.style);
            }
        }
    }
}
export function element(type, attrs) {
    const node = context.getExistingNodeOrRemove(ElementNode, type);
    node.update(attrs);
}
//# sourceMappingURL=core.js.map