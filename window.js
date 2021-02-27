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
var _context, _previousContext, _detailsElem, _value, _haveNewValue;
import { e } from './utils.js';
import { Node, Context, context, queueUpdate } from './core.js';
import { typeText } from './text.js';
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
export function begin(title, getterSetter, flags) {
    const node = context.getExistingNodeOrRemove(WrapperNode, 'details', 'window', getterSetter);
    node.update(getterSetter);
    const active = getterSetter.get();
    node.begin();
    typeText('summary', title);
    return active;
}
export function end() {
    context.finish();
}
//# sourceMappingURL=window.js.map