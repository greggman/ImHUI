import {e} from './utils.js';
import {Node, Context, context, GetSet, queueUpdate} from './core.js';
import {typeText} from './text.js';

export class WrapperNode extends Node {
  #context: Context;
  #previousContext: Context;
  #detailsElem: HTMLDetailsElement;
  #value: boolean;
  #haveNewValue: boolean;

  constructor(type: string, className: string, getterSetter: GetSet<boolean>) {
    super();
    this.#detailsElem = <HTMLDetailsElement>e(type, {open: true, className});
    this.elem = this.#detailsElem;
    this.#context = new Context(this.elem, this.end);
    this.#value = getterSetter.get();
    this.#detailsElem.addEventListener('click', (e) => {
      this.#value = this.#detailsElem.open;
      this.#haveNewValue = true;
      queueUpdate();
    });
  }

  update(getterSetter: GetSet<boolean>): boolean {
    if (this.#haveNewValue) {
      getterSetter.set(this.#value);
      return this.#value;
    } else {
      const value = getterSetter.get();
      if (this.#value !== value) {
        this.#detailsElem.open = !!this.#value;
      }
      return value;
    }
  }

  begin() {
    this.#previousContext = context;
    Context.setCurrentContext(this.#context);
    context.start();
  }

  end = () => {
    Context.setCurrentContext(this.#previousContext);
  }
}

export function begin(
    title: string,
    getterSetter: GetSet<boolean>,
    flags: any) {
  const node = context.getExistingNodeOrRemove<WrapperNode>(WrapperNode, 'details', 'window', getterSetter);
  node.update(getterSetter);
  const active = getterSetter.get();
  node.begin();
  typeText('summary', title);
  return active;
}

export function end() {
  context.finish();
}
