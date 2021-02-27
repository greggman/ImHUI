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

function px(v: number): string {
  return `${v | 0}px`;
}

function addMoveHandlers(elem: HTMLElement) {
}

// FIX: should we split window and window title
// and have window title be implemented from draggable
// where draggable is something like
//
//    draggable('className', gs('obj', 'pos'))
//
// and sizeable()
//
//    sizeable('className', gs('obj', 'size'))
//
// so then the code is something like
//
// const win = {
//   pos: [0, 0],
//   size: [300, 100],
// };
// beingWindow(win.pos, win.size)
//   sizeable('div', gs(win, size))   // allows changing size
//   draggable('window', gs(win, 'pos'))  // allows updating pos
// endWindow();
//   
//  
//

export class WindowNode extends Node {
  #context: Context;
  #previousContext: Context;
  #windowElem: HTMLElement;
  #detailsElem: HTMLDetailsElement;
  #summaryElem: HTMLElement;
  #value: boolean;
  #haveNewValue: boolean;
  #title: string;
  #needSize: boolean = true;

  constructor(title: string, getterSetter: GetSet<boolean>) {
    super();
    this.#summaryElem = e('summary', {textContent: title});
    this.#detailsElem = <HTMLDetailsElement>e('details', {open: true}, [
      this.#summaryElem,
    ]);
    this.#windowElem = e('div', {className: 'window layout-scrollbar'}, [
      this.#detailsElem,
    ]);

    const elem = this.#windowElem;
    let mouseStartX: number;
    let mouseStartY: number;
    let elemStartX: number;
    let elemStartY: number;

    function onMouseMove(e: MouseEvent) {
      const deltaX = e.clientX - mouseStartX;
      const deltaY = e.clientY - mouseStartY;
      elem.style.left = px(elemStartX + deltaX);
      elem.style.top  = px(elemStartY + deltaY);
    }

    function onMouseUp(e: MouseEvent) {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseMove);
    }

    this.#summaryElem.addEventListener('mousedown', (e) => {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      mouseStartX = e.clientX;
      mouseStartY = e.clientY;
      const rect = elem.getBoundingClientRect();
      elemStartX = rect.left | 0;
      elemStartY = rect.top | 0;
    });

    this.#summaryElem.addEventListener('click', (e) => {
      if (e.clientX > 20) {
        e.preventDefault();
      }
    });

    // FIX: should probably go through some API, not directly to document
    // document.body.appendChild(this.#windowElem);
    // append to root so we can get better scrollbars
    document.querySelector('#root').appendChild(this.#windowElem);
    // FIX: this is a place holder because Node requires one
    this.elem = e('div'); 
    this.#context = new Context(this.#detailsElem, this.end);
    this.#value = getterSetter.get();
    this.#detailsElem.addEventListener('click', (e) => {
      if (e.clientX > 20) {
        e.preventDefault();
      }
      this.#value = this.#detailsElem.open;
      this.#haveNewValue = true;
      queueUpdate();
    });
  }

  update(title: string, getterSetter: GetSet<boolean>): boolean {
    if (this.#title !== title) {
      this.#title = title;
      this.#summaryElem.textContent = title;
    }
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
    if (this.#needSize) {
      this.#needSize = false;
      const rect = this.#windowElem.getBoundingClientRect();
      // FIX: hardcoded padding
      this.#windowElem.style.width = px(rect.width + 6);
      this.#windowElem.style.height = px(rect.height + 6);
    }
    Context.setCurrentContext(this.#previousContext);
  }
}

export function begin(
    title: string,
    getterSetter: GetSet<boolean>,
    flags: any) {
  const node = context.getExistingNodeOrRemove<WindowNode>(WindowNode, title, getterSetter);
  node.update(title, getterSetter);
  const active = getterSetter.get();
  node.begin();
  return active;
}

export function end() {
  context.finish();
}
