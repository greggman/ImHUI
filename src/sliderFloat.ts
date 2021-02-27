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

class SliderFloatNode extends Node {
  #inputElem: HTMLInputElement;
  #value: number;
  #haveNewValue: boolean = false;
  #min: number;
  #max: number;

  constructor(getterSetter: GetSet<number>, min: number, max: number) {
    super();
    this.#value = getterSetter.get();
    this.#min = min;
    this.#max = max;
    this.#inputElem = <HTMLInputElement>e('input', {
      type: 'range', min, max, step: (max - min) / 1000,
    });
    this.elem = this.#inputElem;
    this.#inputElem.value = this.#value.toString();
    this.#inputElem.addEventListener('input', (e) => {
      this.#value = parseFloat(this.#inputElem.value);
      this.#haveNewValue = true;
      queueUpdate();
    });
  }

  update(getterSetter: GetSet<number>, min: number, max: number) {
    if (this.#haveNewValue) {
      this.#haveNewValue = false;
      getterSetter.set(this.#value);
      queueUpdateBecausePreviousUsagesMightBeStale();
    } else {
      const value = getterSetter.get();
      if (value != this.#value) {
        this.#value = value;
        this.#inputElem.value = value.toString();
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

export function sliderFloatNode(getterSetter: GetSet<number>, min = 0, max = 1) {
  const node = context.getExistingNodeOrRemove<SliderFloatNode>(SliderFloatNode, getterSetter, min, max);
  node.update(getterSetter, min, max);
}

export function sliderFloat(prompt: string, getterSetter: GetSet<number>, min = 0, max = 1) {
  beginWrapper('slider-float form-line');
    beginWrapper('slider-value');
      sliderFloatNode(getterSetter, min, max);
      text(getterSetter.get().toFixed(2));
    endWrapper();
    text(prompt);
  endWrapper();
}
