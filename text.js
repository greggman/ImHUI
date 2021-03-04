import { Node, context } from './core.js';
class TextNode extends Node {
    constructor(str) {
        super('div');
    }
    #text;
    update(str) {
        if (this.#text !== str) {
            this.#text = str;
            this.elem.textContent = str;
        }
    }
}
class ClassTextNode extends Node {
    constructor(type) {
        // FIX! You can't pass the type OR we need to fix the code
        // that gets an old node because it checks by JS class instanceof
        // not by element type
        super(type);
    }
    #text;
    update(className, str) {
        if (this.#text !== str) {
            this.#text = str;
            this.elem.textContent = str;
        }
        this.setClassName(className);
    }
}
class TypeTextNode extends Node {
    constructor(type) {
        // FIX! You can't pass the type OR we need to fix the code
        // that gets an old node because it checks by JS class instanceof
        // not by element type
        super(type);
    }
    #text;
    update(str) {
        if (this.#text !== str) {
            this.#text = str;
            this.elem.textContent = str;
        }
    }
}
class ColorTextNode extends Node {
    constructor(color, str) {
        super('div');
    }
    #text;
    #color;
    update(color, str) {
        if (this.#text !== str) {
            this.#text = str;
            this.elem.textContent = str;
        }
        if (this.#color !== color) {
            this.#color = color;
            this.elem.style.color = color;
        }
    }
}
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