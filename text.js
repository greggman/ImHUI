var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _text, _text_1, _className, _text_2, _text_3, _color;
import { e } from './utils.js';
import { Node, context } from './core.js';
class TextNode extends Node {
    constructor(str) {
        super();
        _text.set(this, void 0);
        this.elem = e('div');
    }
    update(str) {
        if (__classPrivateFieldGet(this, _text) !== str) {
            __classPrivateFieldSet(this, _text, str);
            this.elem.textContent = str;
        }
    }
}
_text = new WeakMap();
class ClassTextNode extends Node {
    constructor(type, className) {
        super();
        _text_1.set(this, void 0);
        _className.set(this, void 0);
        this.elem = e(type, { className });
    }
    update(className, str) {
        if (__classPrivateFieldGet(this, _text_1) !== str) {
            __classPrivateFieldSet(this, _text_1, str);
            this.elem.textContent = str;
        }
        if (__classPrivateFieldGet(this, _className) !== className) {
            __classPrivateFieldSet(this, _className, className);
            this.elem.className = className;
        }
    }
}
_text_1 = new WeakMap(), _className = new WeakMap();
class TypeTextNode extends Node {
    constructor(type) {
        super();
        _text_2.set(this, void 0);
        this.elem = e(type);
    }
    update(str) {
        if (__classPrivateFieldGet(this, _text_2) !== str) {
            __classPrivateFieldSet(this, _text_2, str);
            this.elem.textContent = str;
        }
    }
}
_text_2 = new WeakMap();
class ColorTextNode extends Node {
    constructor(color, str) {
        super();
        _text_3.set(this, void 0);
        _color.set(this, void 0);
        this.elem = e('div', { style: { color: color } });
    }
    update(color, str) {
        if (__classPrivateFieldGet(this, _text_3) !== str) {
            __classPrivateFieldSet(this, _text_3, str);
            this.elem.textContent = str;
        }
        if (__classPrivateFieldGet(this, _color) !== color) {
            __classPrivateFieldSet(this, _color, color);
            this.elem.style.color = color;
        }
    }
}
_text_3 = new WeakMap(), _color = new WeakMap();
export function classTypeText(type, className, str) {
    const node = context.getExistingNodeOrRemove(ClassTextNode, type, className, str);
    node.update(className, str);
}
export function typeText(type, str) {
    const node = context.getExistingNodeOrRemove(TypeTextNode, type, str);
    node.update(str);
}
export function classText(className, str) {
    classTypeText('div', className, str);
}
export function text(str) {
    const node = context.getExistingNodeOrRemove(TextNode, str);
    node.update(str);
}
export function textColored(color, str) {
    const node = context.getExistingNodeOrRemove(ColorTextNode, color, str);
    node.update(color, str);
}
//# sourceMappingURL=text.js.map