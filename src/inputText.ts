import {e} from './utils.js';
import {
  context,
  GetSet,
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

  constructor(getterSetter: GetSet<string>) {
    super();
    this.#value = getterSetter.get();
    this.#inputElem = <HTMLInputElement>e('input', {type: 'text', value: this.#value});
    this.elem = this.#inputElem,
    this.#inputElem.addEventListener('input', (e) => {
      this.#value = this.#inputElem.value;
      this.#haveNewValue = true;
      queueUpdate();
    });
  }

  update(getterSetter: GetSet<string>) {
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

export function inputTextNode(getterSetter: GetSet<string>) {
  const node = context.getExistingNodeOrRemove<InputTextNode>(InputTextNode, getterSetter);
  node.update(getterSetter);
}

export function inputText(prompt: string, getterSetter: GetSet<string>) {
  beginWrapper('input-text form-line');
    inputTextNode(getterSetter);
    text(prompt);
  endWrapper();
}
