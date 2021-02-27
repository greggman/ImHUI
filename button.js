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
var _result, _prompt;
import { e } from './utils.js';
import { Node, queueUpdate, context } from './core.js';
class ButtonNode extends Node {
    constructor(str) {
        super();
        _result.set(this, false);
        _prompt.set(this, void 0);
        this.elem = e('button');
        this.elem.addEventListener('click', () => {
            __classPrivateFieldSet(this, _result, true);
            queueUpdate();
        });
    }
    update(str) {
        if (__classPrivateFieldGet(this, _prompt) !== str) {
            __classPrivateFieldSet(this, _prompt, str);
            this.elem.textContent = str;
        }
        const result = __classPrivateFieldGet(this, _result);
        __classPrivateFieldSet(this, _result, false);
        return result;
    }
}
_result = new WeakMap(), _prompt = new WeakMap();
export function button(str) {
    const button = context.getExistingNodeOrRemove(ButtonNode, str);
    return button.update(str);
}
//# sourceMappingURL=button.js.map