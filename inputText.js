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
    constructor(value) {
        super();
        _inputElem.set(this, void 0);
        _value.set(this, void 0);
        _haveNewValue.set(this, false);
        __classPrivateFieldSet(this, _value, value);
        __classPrivateFieldSet(this, _inputElem, e('input', { type: 'text', value: __classPrivateFieldGet(this, _value) }));
        this.elem = __classPrivateFieldGet(this, _inputElem),
            __classPrivateFieldGet(this, _inputElem).addEventListener('input', (e) => {
                __classPrivateFieldSet(this, _value, __classPrivateFieldGet(this, _inputElem).value);
                __classPrivateFieldSet(this, _haveNewValue, true);
                queueUpdate();
            });
    }
    update(value) {
        if (__classPrivateFieldGet(this, _haveNewValue)) {
            __classPrivateFieldSet(this, _haveNewValue, false);
            value = __classPrivateFieldGet(this, _value);
            queueUpdateBecausePreviousUsagesMightBeStale();
        }
        else {
            if (value !== __classPrivateFieldGet(this, _value)) {
                __classPrivateFieldSet(this, _value, value);
                __classPrivateFieldGet(this, _inputElem).value = value;
            }
        }
        return value;
    }
}
_inputElem = new WeakMap(), _value = new WeakMap(), _haveNewValue = new WeakMap();
export function inputTextNode(value) {
    const node = context.getExistingNodeOrRemove(InputTextNode, value);
    return node.update(value);
}
export function inputText(prompt, value) {
    beginWrapper('input-text form-line');
    value = inputTextNode(value);
    text(prompt);
    endWrapper();
    return value;
}
//# sourceMappingURL=inputText.js.map