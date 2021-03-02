import {e} from './utils.js';
import {
  context,
  Node,
  queueUpdate,
  queueUpdateBecausePreviousUsagesMightBeStale,
} from './core.js'
import {valueDrag} from './valueDrag.js';
import { beginWrapper, endWrapper } from './child.js';
import { text } from './text.js';

export type Color = number[];

function gs(obj: any, prop: string) {
  return {
    get() { return obj[prop]; },
    set(v: any) { obj[prop] = v; }
  };
}

function isArrayEqual(a1: any[], a2: any[]) {
  if (!a1) {
    return !a2;
  } else if (!a2) {
    return false;
  } else {
    if (a1.length !== a2.length) {
      return false;
    }
    for (let i = 0; i < a1.length; ++i) {
      if (a1[i] !== a2[i]) {
        return false;
      }
    }
  }
  return true;
}

const rgba = (r: number, g: number, b: number, a: number) => `rgba(${r * 255 | 0},${g * 255 | 0},${b * 255 | 0},${a})`

class ColorButtonNode extends Node {
  #result: boolean = false;
  #prompt: string;
  #color: Color;

  constructor(str: string, color: Color) {
    super();
    this.elem = e('div', {className: 'color-button'});
    this.elem.addEventListener('click', () => {
      this.#result = true;
      queueUpdate();
    });
  }

  update(str: string, value: Color): boolean {
    if (this.#prompt !== str) {
      this.#prompt = str;
      this.elem.textContent = str;
    }
    if (!isArrayEqual(value, this.#color)) {
      this.#color = value.slice();
      this.elem.style.backgroundColor = rgba(value[0], value[1], value[2], value[3]);
    }
    const result = this.#result;
    this.#result = false;
    return result;
  }
}

export function colorButton(str: string, value: Color) : boolean {
  const button = context.getExistingNodeOrRemove<ColorButtonNode>(ColorButtonNode, str, value);
  return button.update(str, value);
}

export function colorEdit4(prompt: string, value: Color) {
  beginWrapper('color-edit-4 form-line')
    beginWrapper('color-edit-4-sub')
      value[0] = valueDrag('R:', value[0]);
      value[1] = valueDrag('G:', value[1]);
      value[2] = valueDrag('B:', value[2]);
      value[3] = valueDrag('A:', value[3]);
      colorButton('', value);
    endWrapper();
    text(prompt);
  endWrapper();
}