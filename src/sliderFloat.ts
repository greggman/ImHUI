import {e} from './utils.js';
import {
  context,
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

  constructor() {
    super('input');
    this.#inputElem = <HTMLInputElement>this.elem;
    this.#inputElem.type = 'range';
    this.#inputElem.addEventListener('input', (e) => {
      this.#value = parseFloat(this.#inputElem.value);
      this.#haveNewValue = true;
      queueUpdate();
    });
  }

  update(value: number, min: number, max: number): number {
    if (this.#haveNewValue) {
      this.#haveNewValue = false;
      value = this.#value;
      queueUpdateBecausePreviousUsagesMightBeStale();
    } else {
      if (value !== this.#value) {
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
    return value;
  }
}

export function sliderFloatNode(value: number, min = 0, max = 1): number {
  const node = context.getExistingNodeOrRemove<SliderFloatNode>(SliderFloatNode);
  return node.update(value, min, max);
}

export function sliderFloat(prompt: string, value: number, min = 0, max = 1): number {
  beginWrapper('slider-float form-line');
    beginWrapper('slider-value');
      value = sliderFloatNode(value, min, max);
      text(value.toFixed(2));
    endWrapper();
    text(prompt);
  endWrapper();
  return value;
}
