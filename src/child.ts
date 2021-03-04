import {e} from './utils.js';
import {Node, Context, context} from './core.js';
import {text} from './text.js';

export class BasicWrapperNode extends Node {
  #context: Context;

  constructor() {
    super('div');
    this.#context = new Context(this.elem, this.end);
  }

  begin(className: string) {
    this.setClassName(className);
    Context.pushContext(this.#context);
  }

  end = () => {
    Context.popContext();
  }
}

export function beginWrapper(className: string) {
  const node = context.getExistingNodeOrRemove<BasicWrapperNode>(BasicWrapperNode);
  node.begin(className);
}

export function endWrapper() {
  context.finish();
}

export function beginChild(id: string) {
  beginWrapper('child layout-scrollbar');
}

export function endChild() {
  endWrapper();
}
