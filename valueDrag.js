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
var _prompt, _startValue, _value, _min, _max, _precision, _haveNewValue, _mouseStartX, _moveRange, _onMouseMove, _onMouseUp;
import { clamp, e, } from './utils.js';
import { context, Node, queueUpdate, queueUpdateBecausePreviousUsagesMightBeStale, } from './core.js';
class ValueDragNode extends Node {
    constructor(prompt, getterSetter, min = 0, max = 1, precision = 2) {
        super();
        _prompt.set(this, void 0);
        _startValue.set(this, void 0);
        _value.set(this, void 0);
        _min.set(this, 0);
        _max.set(this, 0);
        _precision.set(this, 2);
        _haveNewValue.set(this, false);
        _mouseStartX.set(this, void 0);
        _moveRange.set(this, 100);
        _onMouseMove.set(this, (e) => {
            const deltaNorm = (e.clientX - __classPrivateFieldGet(this, _mouseStartX)) / __classPrivateFieldGet(this, _moveRange);
            const delta = (__classPrivateFieldGet(this, _max) - __classPrivateFieldGet(this, _min)) * deltaNorm;
            const newValue = clamp(__classPrivateFieldGet(this, _startValue) + delta, __classPrivateFieldGet(this, _min), __classPrivateFieldGet(this, _max));
            __classPrivateFieldSet(this, _value, newValue);
            __classPrivateFieldSet(this, _haveNewValue, true);
            this._update();
            queueUpdate();
        });
        _onMouseUp.set(this, () => {
            window.removeEventListener('mousemove', __classPrivateFieldGet(this, _onMouseMove));
            window.removeEventListener('mouseup', __classPrivateFieldGet(this, _onMouseUp));
        });
        __classPrivateFieldSet(this, _min, min);
        __classPrivateFieldSet(this, _max, max);
        __classPrivateFieldSet(this, _precision, precision);
        __classPrivateFieldSet(this, _prompt, prompt);
        this.elem = e('div', { className: 'value-drag' });
        this.elem.addEventListener('mousedown', (e) => {
            console.log('mousedown');
            __classPrivateFieldSet(this, _mouseStartX, e.clientX);
            __classPrivateFieldSet(this, _startValue, __classPrivateFieldGet(this, _value));
            window.addEventListener('mousemove', __classPrivateFieldGet(this, _onMouseMove));
            window.addEventListener('mouseup', __classPrivateFieldGet(this, _onMouseUp));
        });
    }
    _update() {
        this.elem.textContent = `${__classPrivateFieldGet(this, _prompt)}${__classPrivateFieldGet(this, _value).toFixed(__classPrivateFieldGet(this, _precision))}`;
    }
    update(prompt, getterSetter, min = 0, max = 1, precision = 2) {
        if (__classPrivateFieldGet(this, _haveNewValue)) {
            __classPrivateFieldSet(this, _haveNewValue, false);
            getterSetter.set(__classPrivateFieldGet(this, _value));
            queueUpdateBecausePreviousUsagesMightBeStale();
        }
        else {
            const value = getterSetter.get();
            if (value !== __classPrivateFieldGet(this, _value) ||
                prompt !== __classPrivateFieldGet(this, _prompt) ||
                min !== __classPrivateFieldGet(this, _min) ||
                max !== __classPrivateFieldGet(this, _max) ||
                precision !== __classPrivateFieldGet(this, _precision)) {
                __classPrivateFieldSet(this, _value, clamp(value, min, max));
                __classPrivateFieldSet(this, _prompt, prompt);
                __classPrivateFieldSet(this, _min, min);
                __classPrivateFieldSet(this, _max, max);
                __classPrivateFieldSet(this, _precision, precision);
                this._update();
            }
        }
    }
}
_prompt = new WeakMap(), _startValue = new WeakMap(), _value = new WeakMap(), _min = new WeakMap(), _max = new WeakMap(), _precision = new WeakMap(), _haveNewValue = new WeakMap(), _mouseStartX = new WeakMap(), _moveRange = new WeakMap(), _onMouseMove = new WeakMap(), _onMouseUp = new WeakMap();
export function valueDrag(prompt, getterSetter, min = 0, max = 1, precision = 2) {
    const node = context.getExistingNodeOrRemove(ValueDragNode, getterSetter, min, max);
    node.update(prompt, getterSetter, min, max);
}
//# sourceMappingURL=valueDrag.js.map