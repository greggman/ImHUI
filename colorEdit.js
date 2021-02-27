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
var _result, _prompt, _color;
import { e } from './utils.js';
import { context, Node, queueUpdate, } from './core.js';
import { valueDrag } from './valueDrag.js';
import { beginWrapper, endWrapper } from './child.js';
import { text } from './text.js';
function gs(obj, prop) {
    return {
        get() { return obj[prop]; },
        set(v) { obj[prop] = v; }
    };
}
function isArrayEqual(a1, a2) {
    if (!a1) {
        return !a2;
    }
    else if (!a2) {
        return false;
    }
    else {
        if (a1.length !== a2.length) {
            return false;
        }
        for (let i = 0; i < a1.length; ++i) {
            if (a1[i] !== a2[i]) {
                return false;
            }
        }
    }
    return true;
}
const rgba = (r, g, b, a) => `rgba(${r * 255 | 0},${g * 255 | 0},${b * 255 | 0},${a})`;
class ColorButtonNode extends Node {
    constructor(str, color) {
        super();
        _result.set(this, false);
        _prompt.set(this, void 0);
        _color.set(this, void 0);
        this.elem = e('div', { className: 'color-button' });
        this.elem.addEventListener('click', () => {
            __classPrivateFieldSet(this, _result, true);
            queueUpdate();
        });
    }
    update(str, color) {
        if (__classPrivateFieldGet(this, _prompt) !== str) {
            __classPrivateFieldSet(this, _prompt, str);
            this.elem.textContent = str;
        }
        const value = color.get();
        if (!isArrayEqual(value, __classPrivateFieldGet(this, _color))) {
            __classPrivateFieldSet(this, _color, value.slice());
            this.elem.style.backgroundColor = rgba(value[0], value[1], value[2], value[3]);
        }
        const result = __classPrivateFieldGet(this, _result);
        __classPrivateFieldSet(this, _result, false);
        return result;
    }
}
_result = new WeakMap(), _prompt = new WeakMap(), _color = new WeakMap();
export function colorButton(str, color) {
    const button = context.getExistingNodeOrRemove(ColorButtonNode, str, color);
    return button.update(str, color);
}
export function colorEdit4(prompt, color) {
    beginWrapper('color-edit-4 form-line');
    beginWrapper('color-edit-4-sub');
    valueDrag('R:', gs(color.get(), '0'));
    valueDrag('G:', gs(color.get(), '1'));
    valueDrag('B:', gs(color.get(), '2'));
    valueDrag('A:', gs(color.get(), '3'));
    colorButton('', color);
    endWrapper();
    text(prompt);
    endWrapper();
}
//# sourceMappingURL=colorEdit.js.map