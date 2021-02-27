var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _context, _previousContext, _detailsElem, _value, _haveNewValue, _context_1, _previousContext_1, _windowElem, _detailsElem_1, _summaryElem, _value_1, _haveNewValue_1, _title, _needSize;
import { e } from './utils.js';
import { Node, Context, context, queueUpdate } from './core.js';
export class WrapperNode extends Node {
    constructor(type, className, getterSetter) {
        super();
        _context.set(this, void 0);
        _previousContext.set(this, void 0);
        _detailsElem.set(this, void 0);
        _value.set(this, void 0);
        _haveNewValue.set(this, void 0);
        this.end = () => {
            Context.setCurrentContext(__classPrivateFieldGet(this, _previousContext));
        };
        __classPrivateFieldSet(this, _detailsElem, e(type, { open: true, className }));
        this.elem = __classPrivateFieldGet(this, _detailsElem);
        __classPrivateFieldSet(this, _context, new Context(this.elem, this.end));
        __classPrivateFieldSet(this, _value, getterSetter.get());
        __classPrivateFieldGet(this, _detailsElem).addEventListener('click', (e) => {
            __classPrivateFieldSet(this, _value, __classPrivateFieldGet(this, _detailsElem).open);
            __classPrivateFieldSet(this, _haveNewValue, true);
            queueUpdate();
        });
    }
    update(getterSetter) {
        if (__classPrivateFieldGet(this, _haveNewValue)) {
            getterSetter.set(__classPrivateFieldGet(this, _value));
            return __classPrivateFieldGet(this, _value);
        }
        else {
            const value = getterSetter.get();
            if (__classPrivateFieldGet(this, _value) !== value) {
                __classPrivateFieldGet(this, _detailsElem).open = !!__classPrivateFieldGet(this, _value);
            }
            return value;
        }
    }
    begin() {
        __classPrivateFieldSet(this, _previousContext, context);
        Context.setCurrentContext(__classPrivateFieldGet(this, _context));
        context.start();
    }
}
_context = new WeakMap(), _previousContext = new WeakMap(), _detailsElem = new WeakMap(), _value = new WeakMap(), _haveNewValue = new WeakMap();
function px(v) {
    return `${v | 0}px`;
}
function addMoveHandlers(elem) {
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
    constructor(title, getterSetter) {
        super();
        _context_1.set(this, void 0);
        _previousContext_1.set(this, void 0);
        _windowElem.set(this, void 0);
        _detailsElem_1.set(this, void 0);
        _summaryElem.set(this, void 0);
        _value_1.set(this, void 0);
        _haveNewValue_1.set(this, void 0);
        _title.set(this, void 0);
        _needSize.set(this, true);
        this.end = () => {
            if (__classPrivateFieldGet(this, _needSize)) {
                __classPrivateFieldSet(this, _needSize, false);
                const rect = __classPrivateFieldGet(this, _windowElem).getBoundingClientRect();
                // FIX: hardcoded padding
                __classPrivateFieldGet(this, _windowElem).style.width = px(Math.max(400, rect.width + 6));
                __classPrivateFieldGet(this, _windowElem).style.height = px(rect.height + 6);
            }
            Context.setCurrentContext(__classPrivateFieldGet(this, _previousContext_1));
        };
        __classPrivateFieldSet(this, _summaryElem, e('summary', { textContent: title }));
        __classPrivateFieldSet(this, _detailsElem_1, e('details', { open: true }, [
            __classPrivateFieldGet(this, _summaryElem),
        ]));
        __classPrivateFieldSet(this, _windowElem, e('div', { className: 'window layout-scrollbar' }, [
            __classPrivateFieldGet(this, _detailsElem_1),
        ]));
        const elem = __classPrivateFieldGet(this, _windowElem);
        let mouseStartX;
        let mouseStartY;
        let elemStartX;
        let elemStartY;
        function onMouseMove(e) {
            const deltaX = e.clientX - mouseStartX;
            const deltaY = e.clientY - mouseStartY;
            elem.style.left = px(elemStartX + deltaX);
            elem.style.top = px(elemStartY + deltaY);
        }
        function onMouseUp(e) {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseMove);
        }
        __classPrivateFieldGet(this, _summaryElem).addEventListener('mousedown', (e) => {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            mouseStartX = e.clientX;
            mouseStartY = e.clientY;
            const rect = elem.getBoundingClientRect();
            elemStartX = rect.left | 0;
            elemStartY = rect.top | 0;
        });
        __classPrivateFieldGet(this, _summaryElem).addEventListener('click', (e) => {
            if (e.clientX > 20) {
                e.preventDefault();
            }
        });
        // FIX: should probably go through some API, not directly to document
        // document.body.appendChild(this.#windowElem);
        // append to root so we can get better scrollbars
        document.querySelector('#root').appendChild(__classPrivateFieldGet(this, _windowElem));
        // FIX: this is a place holder because Node requires one
        this.elem = e('div');
        __classPrivateFieldSet(this, _context_1, new Context(__classPrivateFieldGet(this, _detailsElem_1), this.end));
        __classPrivateFieldSet(this, _value_1, getterSetter.get());
        __classPrivateFieldGet(this, _detailsElem_1).addEventListener('click', (e) => {
            if (e.clientX > 20) {
                e.preventDefault();
            }
            __classPrivateFieldSet(this, _value_1, __classPrivateFieldGet(this, _detailsElem_1).open);
            __classPrivateFieldSet(this, _haveNewValue_1, true);
            queueUpdate();
        });
    }
    update(title, getterSetter) {
        if (__classPrivateFieldGet(this, _title) !== title) {
            __classPrivateFieldSet(this, _title, title);
            __classPrivateFieldGet(this, _summaryElem).textContent = title;
        }
        if (__classPrivateFieldGet(this, _haveNewValue_1)) {
            getterSetter.set(__classPrivateFieldGet(this, _value_1));
            return __classPrivateFieldGet(this, _value_1);
        }
        else {
            const value = getterSetter.get();
            if (__classPrivateFieldGet(this, _value_1) !== value) {
                __classPrivateFieldGet(this, _detailsElem_1).open = !!__classPrivateFieldGet(this, _value_1);
            }
            return value;
        }
    }
    begin() {
        __classPrivateFieldSet(this, _previousContext_1, context);
        Context.setCurrentContext(__classPrivateFieldGet(this, _context_1));
        context.start();
    }
}
_context_1 = new WeakMap(), _previousContext_1 = new WeakMap(), _windowElem = new WeakMap(), _detailsElem_1 = new WeakMap(), _summaryElem = new WeakMap(), _value_1 = new WeakMap(), _haveNewValue_1 = new WeakMap(), _title = new WeakMap(), _needSize = new WeakMap();
export function begin(title, getterSetter, flags) {
    const node = context.getExistingNodeOrRemove(WindowNode, title, getterSetter);
    node.update(title, getterSetter);
    const active = getterSetter.get();
    node.begin();
    return active;
}
export function end() {
    context.finish();
}
//# sourceMappingURL=window.js.map