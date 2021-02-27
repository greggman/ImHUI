import {e} from './utils.js';
import {Node, Context, context} from './core.js';
import {text} from './text.js';

export class BasicWrapperNode extends Node {
  #context: Context;
  #previousContext: Context;

  constructor(className: string) {
    super();
    this.elem = e('div', {className});
    this.#context = new Context(this.elem, this.end);
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

export function beginWrapper(className: string) {
  const node = context.getExistingNodeOrRemove<BasicWrapperNode>(BasicWrapperNode, className);
  node.begin();
}

export function endWrapper() {
  context.finish();
}

export function beginChild(id: string) {
  beginWrapper('child');
}

export function endChild() {
  endWrapper();
}
