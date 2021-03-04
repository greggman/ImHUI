import { e } from './utils.js';

export class Node {
  elem: HTMLElement;
  #className: string;
  getAs<T extends Node>(ctor: {new (...args: any[]):T}): T | undefined {
    return this instanceof ctor ? <T>(this) : undefined;
  }
  constructor(type: string | HTMLElement) {
    if (typeof type === 'string') {
      this.elem = document.createElement(type);
    } else {
      this.elem = type;
    }
  }
  setClassName(className: string) {
    if (this.#className !== className) {
      this.#className = className;
      this.elem.className = className;
    }
  }
  setParent(parent?: HTMLElement) {
    if (parent) {
      parent.appendChild(this.elem);
    } else {
      this.remove();
    }
  }
  remove() {
    this.elem.remove();
  }
};

const stack: Node[] = [];
const noop = () => {};
const contextStack: Context[] = [];

export class Context {
  #currentElem: HTMLElement;
  #currentParent: Node;
  #currentChildrenByKey: Map<string, Node> = new Map();
  #currentUsedKeys: Set<string> = new Set();
  #children: Node[] = [];
  #currentKey: number = 0;
  #finishFn: () => void;

  constructor(elem: HTMLElement, finishFn: () => void = noop) {
    this.#currentElem = elem;
    this.#finishFn = finishFn;
  }

  getExistingNodeOrRemove<T extends Node>(ctor: {new (...args: any[]):T}, ...args: any[]): T {
    const key = (this.#currentKey++).toString();
    let node = this.#currentChildrenByKey.get(key);
    let typedNode = node?.getAs<T>(ctor);
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
      } else {
        node.remove();
        this.#currentChildrenByKey.delete(key);
      }
    }
    
    this.#finishFn();
  }

  /*
  static setCurrentContext(newContext: Context) {
    context = newContext;
  }

  static getCurrentContext(): Context {
    return context;
  }
  */

  static pushContext(newContext: Context) {
    contextStack.push(context);
    context = newContext;
    context.start();
  }

  static popContext() {
    context = contextStack.pop();
  }
}

export let context: Context;
let currentRenderUIFunc: () => void;
let updateId: number;

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
  #context: Context;

  constructor(elem: HTMLElement) {
    super(elem);
    this.#context = new Context(elem);
  }

  // FIX!
  setAsCurrent() {
    context = this.#context;
  }

  // FIX!
  isCurrent() {
    return context === this.#context;
  }
}

let root: RootNode;

export function setup(elem: HTMLElement, renderUIFunc: () => void) {
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

function copyChanges(src: any, shadow: any, dst: any) {
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
  #text: string;
  #attrs: Record<string, any>;
  #style: Record<string, any>;

  constructor(type: string) {
    super(type);
    this.#attrs = {};
    this.#style = {};
  }
  update(attrs?: Record<string, any>) {
    if (attrs) {
      copyChanges(attrs, this.#attrs, this.elem);
      const {style} = attrs;
      if (style) {
        copyChanges(style, this.#style, this.elem.style);
      }
    }
  }
}

export function element(type: string, attrs?: Record<string, any>) {
  const node = context.getExistingNodeOrRemove<ElementNode>(ElementNode, type);
  node.update(attrs);
}
