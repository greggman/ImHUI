import {e} from './utils.js';
import {Node, queueUpdate, context} from './core.js';

class ButtonNode extends Node {
  #result: boolean = false;
  #prompt: string;

  constructor(str: string) {
    super('button');
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