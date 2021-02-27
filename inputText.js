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
var _inputElem, _value, _haveNewValue;
import { e } from './utils.js';
import { context, Node, queueUpdate, queueUpdateBecausePreviousUsagesMightBeStale, } from './core.js';
import { text } from './text.js';
import { beginWrapper, endWrapper } from './child.js';
class InputTextNode extends Node {
    constructor(getterSetter) {
        super();
        _inputElem.set(this, void 0);
        _value.set(this, void 0);
        _haveNewValue.set(this, false);
        __classPrivateFieldSet(this, _value, getterSetter.get());
        __classPrivateFieldSet(this, _inputElem, e('input', { type: 'text', value: __classPrivateFieldGet(this, _value) }));
        this.elem = __classPrivateFieldGet(this, _inputElem),
            __classPrivateFieldGet(this, _inputElem).addEventListener('input', (e) => {
                __classPrivateFieldSet(this, _value, __classPrivateFieldGet(this, _inputElem).value);
                __classPrivateFieldSet(this, _haveNewValue, true);
                queueUpdate();
            });
    }
    update(getterSetter) {
        if (__classPrivateFieldGet(this, _haveNewValue)) {
            __classPrivateFieldSet(this, _haveNewValue, false);
            getterSetter.set(__classPrivateFieldGet(this, _value));
            queueUpdateBecausePreviousUsagesMightBeStale();
        }
        else {
            const value = getterSetter.get();
            if (value !== __classPrivateFieldGet(this, _value)) {
                __classPrivateFieldSet(this, _value, value);
                __classPrivateFieldGet(this, _inputElem).value = value;
            }
        }
    }
}
_inputElem = new WeakMap(), _value = new WeakMap(), _haveNewValue = new WeakMap();
export function inputTextNode(getterSetter) {
    const node = context.getExistingNodeOrRemove(InputTextNode, getterSetter);
    node.update(getterSetter);
}
export function inputText(prompt, getterSetter) {
    beginWrapper('input-text form-line');
    inputTextNode(getterSetter);
    text(prompt);
    endWrapper();
}
//# sourceMappingURL=inputText.js.map