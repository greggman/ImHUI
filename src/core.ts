import { e } from './utils.js';

export class Node {
  elem: HTMLElement;
  getAs<T extends Node>(ctor: {new (...args: any[]):T}): T | undefined {
    return this instanceof ctor ? <T>(this) : undefined;
  }
};

const stack: Node[] = [];
const noop = () => {};

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
        node.elem.remove();
      }
      typedNode = new ctor(...args);
      this.#currentElem.appendChild(typedNode.elem);
      this.#currentChildrenByKey.set(key, typedNode);
    }
    this.#currentUsedKeys.add(key);
    return typedNode;
  }

  start() {
    this.#currentKey = 0;
  }

  finish() {
    // TODO: remove unused
    const unused = new Set();
    this.#finishFn();
  }

  static setCurrentContext(newContext: Context) {
    context = newContext;
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
    super();
    this.#context = new Context(elem);
  }

  // FIX!
  setAsCurrent() {
    context = this.#context;
  }
}

export function setup(elem: HTMLElement, renderUIFunc: () => void) {
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
    super();
    this.elem = e(type);
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
