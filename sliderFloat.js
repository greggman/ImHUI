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
var _inputElem, _value, _haveNewValue, _min, _max;
import { e } from './utils.js';
import { context, Node, queueUpdate, queueUpdateBecausePreviousUsagesMightBeStale, } from './core.js';
import { text } from './text.js';
import { beginWrapper, endWrapper } from './child.js';
class SliderFloatNode extends Node {
    constructor(getterSetter, min, max) {
        super();
        _inputElem.set(this, void 0);
        _value.set(this, void 0);
        _haveNewValue.set(this, false);
        _min.set(this, void 0);
        _max.set(this, void 0);
        __classPrivateFieldSet(this, _value, getterSetter.get());
        __classPrivateFieldSet(this, _min, min);
        __classPrivateFieldSet(this, _max, max);
        __classPrivateFieldSet(this, _inputElem, e('input', {
            type: 'range', min, max, step: (max - min) / 1000,
        }));
        this.elem = __classPrivateFieldGet(this, _inputElem);
        __classPrivateFieldGet(this, _inputElem).value = __classPrivateFieldGet(this, _value).toString();
        __classPrivateFieldGet(this, _inputElem).addEventListener('input', (e) => {
            __classPrivateFieldSet(this, _value, parseFloat(__classPrivateFieldGet(this, _inputElem).value));
            __classPrivateFieldSet(this, _haveNewValue, true);
            queueUpdate();
        });
    }
    update(getterSetter, min, max) {
        if (__classPrivateFieldGet(this, _haveNewValue)) {
            __classPrivateFieldSet(this, _haveNewValue, false);
            getterSetter.set(__classPrivateFieldGet(this, _value));
            queueUpdateBecausePreviousUsagesMightBeStale();
        }
        else {
            const value = getterSetter.get();
            if (value != __classPrivateFieldGet(this, _value)) {
                __classPrivateFieldSet(this, _value, value);
                __classPrivateFieldGet(this, _inputElem).value = value.toString();
            }
        }
        if (min !== __classPrivateFieldGet(this, _min)) {
            __classPrivateFieldSet(this, _min, min);
            __classPrivateFieldGet(this, _inputElem).min = min.toString();
            __classPrivateFieldGet(this, _inputElem).step = ((__classPrivateFieldGet(this, _max) - __classPrivateFieldGet(this, _min)) / 1000).toString();
        }
        if (max !== __classPrivateFieldGet(this, _max)) {
            __classPrivateFieldSet(this, _max, max);
            __classPrivateFieldGet(this, _inputElem).max = max.toString();
            __classPrivateFieldGet(this, _inputElem).step = ((__classPrivateFieldGet(this, _max) - __classPrivateFieldGet(this, _min)) / 1000).toString();
        }
    }
}
_inputElem = new WeakMap(), _value = new WeakMap(), _haveNewValue = new WeakMap(), _min = new WeakMap(), _max = new WeakMap();
export function sliderFloatNode(getterSetter, min = 0, max = 1) {
    const node = context.getExistingNodeOrRemove(SliderFloatNode, getterSetter, min, max);
    node.update(getterSetter, min, max);
}
export function sliderFloat(prompt, getterSetter, min = 0, max = 1) {
    beginWrapper('slider-float form-line');
    beginWrapper('slider-value');
    sliderFloatNode(getterSetter, min, max);
    text(getterSetter.get().toFixed(2));
    endWrapper();
    text(prompt);
    endWrapper();
}
//# sourceMappingURL=sliderFloat.js.map