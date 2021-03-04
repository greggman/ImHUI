import {e} from './utils.js';
import {Node, context} from './core.js'

class TextNode extends Node {
  #text: string;

  constructor(str: string) {
    super('div');
  }
  update(str: string) {
    if (this.#text !== str) {
      this.#text = str;
      this.elem.textContent = str;
    }
  }
}

class ClassTextNode extends Node {
  #text: string;

  constructor(type: string) {
    // FIX! You can't pass the type OR we need to fix the code
    // that gets an old node because it checks by JS class instanceof
    // not by element type
    super(type);
  }
  update(className: string, str: string) {
    if (this.#text !== str) {
      this.#text = str;
      this.elem.textContent = str;
    }
    this.setClassName(className);
  }
}

class TypeTextNode extends Node {
  #text: string;

  constructor(type: string) {
    // FIX! You can't pass the type OR we need to fix the code
    // that gets an old node because it checks by JS class instanceof
    // not by element type
    super(type);
  }
  update(str: string) {
    if (this.#text !== str) {
      this.#text = str;
      this.elem.textContent = str;
    }
  }
}

class ColorTextNode extends Node {
  #text: string;
  #color: string

  constructor(color: string, str: string) {
    super('div');
  }
  update(color: string, str: string) {
    if (this.#text !== str) {
      this.#text = str;
      this.elem.textContent = str;
    }
    if (this.#color !== color) {
      this.#color = color;
      this.elem.style.color = color;
    }
  }
}

export function classTypeText(type: string, className: string, str: string) {
  const node = context.getExistingNodeOrRemove<ClassTextNode>(ClassTextNode, type, className, str);
  node.update(className, str);
}

export function typeText(type: string, str: string) {
  const node = context.getExistingNodeOrRemove<TypeTextNode>(TypeTextNode, type, str);
  node.update(str);
}

export function classText(className: string, str: string) {
  classTypeText('div', className, str);
}

export function text(str: string) {
  const node = context.getExistingNodeOrRemove<TextNode>(TextNode, str);
  node.update(str);
}

export function textColored(color: string, str: string) {
  const node = context.getExistingNodeOrRemove<ColorTextNode>(ColorTextNode, color, str);
  node.update(color, str);
}