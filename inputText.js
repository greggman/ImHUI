import { context, Node, queueUpdate, queueUpdateBecausePreviousUsagesMightBeStale, } from './core.js';
import { text } from './text.js';
import { beginWrapper, endWrapper } from './child.js';
class InputTextNode extends Node {
    constructor(value) {
        super('input');
        this.#haveNewValue = false;
        const inputElem = this.elem;
        inputElem.type = 'text';
        inputElem.addEventListener('input', (e) => {
            this.#value = inputElem.value;
            this.#haveNewValue = true;
            queueUpdate();
        });
    }
    #value;
    #haveNewValue;
    update(value) {
        if (this.#haveNewValue) {
            this.#haveNewValue = false;
            value = this.#value;
            queueUpdateBecausePreviousUsagesMightBeStale();
        }
        else {
            if (value !== this.#value) {
                this.#value = value;
                this.elem.value = value;
            }
        }
        return value;
    }
}
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