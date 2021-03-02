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
  #inputElem: HTMLInputElement;
  #value: string;
  #haveNewValue: boolean = false;

  constructor(value: string) {
    super();
    this.#value = value;
    this.#inputElem = <HTMLInputElement>e('input', {type: 'text', value: this.#value});
    this.elem = this.#inputElem,
    this.#inputElem.addEventListener('input', (e) => {
      this.#value = this.#inputElem.value;
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
        this.#inputElem.value = value;
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
