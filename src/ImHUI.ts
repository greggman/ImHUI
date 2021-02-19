function e(tag: string, attrs = {}, children: (HTMLElement|string)[] = []): HTMLElement { 
  const elem = <any>document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) {
        elem[key][k] = v;
      }
    } else if (elem[key] === undefined) {
      elem.setAttribute(key, value);
    } else {
      elem[key] = value;
    }
  }
  if (Array.isArray(children)) {
    for (const child of children) {
      if (typeof child === 'string') {
        elem.appendChild(document.createTextNode(child));
      } else {
        elem.appendChild(child);
      }
    }
  } else {
    elem.textContent = children;
  }
  return elem;
}

const stack: Node[] = [];

class Context {
  #currentElem: HTMLElement;
  #currentParent: Node;
  #currentChildrenByKey: Map<string, Node> = new Map();
  #currentUsedKeys: Set<string> = new Set();
  #children: Node[] = [];
  #currentKey: number = 0;

  constructor(elem: HTMLElement) {
    this.#currentElem = elem;
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
  }
}

let context: Context;
let currentRenderUIFunc: () => void;
let updateId: number;

function update() {
  updateId = undefined;
  currentRenderUIFunc();
}

function queueUpdate() {
  if (!updateId) {
    updateId = requestAnimationFrame(update);
  }
}

function queueUpdateBecausePreviousUsagesMightBeStale() {
  queueUpdate();
}

class Node {
  elem: HTMLElement;
  getAs<T extends Node>(ctor: {new (...args: any[]):T}): T | undefined {
    return this instanceof ctor ? <T>(this) : undefined;
  }
};

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
}

class ButtonNode extends Node {
  #result: boolean = false;
  #prompt: string;

  constructor(str: string) {
    super();
    this.elem = e('button');
    this.elem.addEventListener('click', () => {
      this.#result = true;
      queueUpdate();
    });
  }

  update(str: string): boolean {
    if (this.#prompt !== str) {
      this.#prompt = str;
      this.elem.textContent = str;
    }
    const result = this.#result;
    this.#result = false;
    return result;
  }
}

export function button(str: string) : boolean {
  const button = context.getExistingNodeOrRemove<ButtonNode>(ButtonNode, str);
  return button.update(str);
}

class TextNode extends Node {
  #text: string;

  constructor(str: string) {
    super();
    this.elem = e('div');
  }
  update(str: string) {
    if (this.#text !== str) {
      this.#text = str;
      this.elem.textContent = str;
    }
  }
}

export function text(str: string) {
  const node = context.getExistingNodeOrRemove<TextNode>(TextNode, str);
  node.update(str);
}

interface GetSet<T> {
  get(): T;
  set(v: T): void;
}

class InputTextNode extends Node {
  #promptElem: HTMLElement;
  #inputElem: HTMLInputElement;
  #prompt: string;
  #value: string;
  #haveNewValue: boolean = false;

  constructor(prompt: string, getterSetter: GetSet<string>) {
    super();
    this.#value = getterSetter.get();
    this.#promptElem = e('div');
    this.#inputElem = <HTMLInputElement>e('input', {type: 'text', value: this.#value});
    this.elem = e('div', {className: 'input-text'}, [
      this.#promptElem,
      this.#inputElem,
    ]);
    this.#inputElem.addEventListener('input', (e) => {
      this.#value = this.#inputElem.value;
      this.#haveNewValue = true;
      queueUpdate();
    });
  }

  update(prompt: string, getterSetter: GetSet<string>) {
    if (prompt !== this.#prompt) {
      this.#promptElem.textContent = prompt;
    }
    if (this.#haveNewValue) {
      this.#haveNewValue = false;
      getterSetter.set(this.#value);
      queueUpdateBecausePreviousUsagesMightBeStale();
    } else {
      const value = getterSetter.get();
      if (value !== this.#value) {
        this.#value = value;
        this.#inputElem.value = value;
      }
    }
  }
}

export function inputText(prompt: string, getterSetter: GetSet<string>) {
  const node = context.getExistingNodeOrRemove<InputTextNode>(InputTextNode, prompt, getterSetter);
  node.update(prompt, getterSetter);
}

class SliderFloatNode extends Node {
  #promptElem: HTMLElement;
  #inputElem: HTMLInputElement;
  #valueElem: HTMLElement;
  #prompt: string;
  #value: number;
  #haveNewValue: boolean = false;
  #min: number;
  #max: number;

  constructor(prompt: string, getterSetter: GetSet<number>, min: number, max: number) {
    super();
    this.#value = getterSetter.get();
    this.#min = min;
    this.#max = max;
    this.#promptElem = e('div');
    this.#inputElem = <HTMLInputElement>e('input', {
      type: 'range', min, max, step: (max - min) / 1000,
    });
    this.#inputElem.value = this.#value.toString();
    this.#valueElem = e('div', {}, [this.#value.toString()]);
    this.elem = e('div', {className: 'input-range'}, [
      this.#promptElem,
      this.#inputElem,
      this.#valueElem,
    ]);
    this.#inputElem.addEventListener('input', (e) => {
      this.#value = parseFloat(this.#inputElem.value);
      this.#valueElem.textContent = this.#value.toString();
      this.#haveNewValue = true;
      queueUpdate();
    });
  }

  update(prompt: string, getterSetter: GetSet<number>, min: number, max: number) {
    if (prompt !== this.#prompt) {
      this.#promptElem.textContent = prompt;
    }
    if (this.#haveNewValue) {
      this.#haveNewValue = false;
      getterSetter.set(this.#value);
      queueUpdateBecausePreviousUsagesMightBeStale();
    } else {
      const value = getterSetter.get();
      if (value != this.#value) {
        this.#value = value;
        this.#inputElem.value = value.toString();
        this.#valueElem.textContent = value.toString();
      }
    }
    if (min !== this.#min) {
      this.#min = min;
      this.#inputElem.min = min.toString();
      this.#inputElem.step = ((this.#max - this.#min) / 1000).toString();
    }
    if (max !== this.#max) {
      this.#max = max;
      this.#inputElem.max = max.toString();
      this.#inputElem.step = ((this.#max - this.#min) / 1000).toString();
    }
  }
}

export function sliderFloat(prompt: string, getterSetter: GetSet<number>, min = 0, max = 1) {
  const node = context.getExistingNodeOrRemove<SliderFloatNode>(SliderFloatNode, prompt, getterSetter, min, max);
  node.update(prompt, getterSetter, min, max);
}

export function start() {
  context.start();
}

export function finish() {
  context.finish();
}



