import {e} from './utils.js';
import {
  context,
  Node,
  queueUpdate,
  queueUpdateBecausePreviousUsagesMightBeStale,
 } from './core.js'
import {text} from './text.js';
import { beginWrapper, endWrapper } from './child.js';

class InputTextNode extends Node {
  #value: string;
  #haveNewValue: boolean = false;

  constructor(value: string) {
    super('input');
    const inputElem = <HTMLInputElement>this.elem;
    inputElem.type = 'text';
    inputElem.addEventListener('input', (e) => {
      this.#value = inputElem.value;
      this.#haveNewValue = true;
      queueUpdate();
    });
  }

  update(value: string): string {
    if (this.#haveNewValue) {
      this.#haveNewValue = false;
      value = this.#value;
      queueUpdateBecausePreviousUsagesMightBeStale();
    } else {
      if (value !== this.#value) {
        this.#value = value;
        (<HTMLInputElement>this.elem).value = value;
      }
    }
    return value;
  }
}

export function inputTextNode(value: string) {
  const node = context.getExistingNodeOrRemove<InputTextNode>(InputTextNode, value);
  return node.update(value);
}

export function inputText(prompt: string, value: string): string {
  beginWrapper('input-text form-line');
    value = inputTextNode(value);
    text(prompt);
  endWrapper();
  return value;
}
