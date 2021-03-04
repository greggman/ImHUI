import { clamp, } from './utils.js';
import { context, Node, queueUpdate, queueUpdateBecausePreviousUsagesMightBeStale, } from './core.js';
class ValueDragNode extends Node {
    constructor(prompt, value, min = 0, max = 1, precision = 2) {
        super('div');
        this.#min = 0;
        this.#max = 0;
        this.#precision = 2;
        this.#haveNewValue = false;
        this.#moveRange = 100;
        this.#onMouseMove = (e) => {
            const deltaNorm = (e.clientX - this.#mouseStartX) / this.#moveRange;
            const delta = (this.#max - this.#min) * deltaNorm;
            const newValue = clamp(this.#startValue + delta, this.#min, this.#max);
            this.#value = newValue;
            this.#haveNewValue = true;
            this._update();
            queueUpdate();
        };
        this.#onMouseUp = () => {
            window.removeEventListener('mousemove', this.#onMouseMove);
            window.removeEventListener('mouseup', this.#onMouseUp);
        };
        this.setClassName('value-drag');
        this.elem.addEventListener('mousedown', (e) => {
            this.#mouseStartX = e.clientX;
            this.#startValue = this.#value;
            window.addEventListener('mousemove', this.#onMouseMove);
            window.addEventListener('mouseup', this.#onMouseUp);
        });
    }
    #prompt;
    #startValue;
    #value;
    #min;
    #max;
    #precision;
    #haveNewValue;
    #mouseStartX;
    #moveRange;
    #onMouseMove;
    #onMouseUp;
    _update() {
        this.elem.textContent = `${this.#prompt}${this.#value.toFixed(this.#precision)}`;
    }
    update(prompt, value, min = 0, max = 1, precision = 2) {
        if (this.#haveNewValue) {
            this.#haveNewValue = false;
            value = this.#value;
            queueUpdateBecausePreviousUsagesMightBeStale();
        }
        else {
            if (value !== this.#value ||
                prompt !== this.#prompt ||
                min !== this.#min ||
                max !== this.#max ||
                precision !== this.#precision) {
                this.#value = clamp(value, min, max);
                this.#prompt = prompt;
                this.#min = min;
                this.#max = max;
                this.#precision = precision;
                this._update();
            }
        }
        return value;
    }
}
export function valueDrag(prompt, value, min = 0, max = 1, precision = 2) {
    const node = context.getExistingNodeOrRemove(ValueDragNode, value, min, max);
    return node.update(prompt, value, min, max);
}
//# sourceMappingURL=valueDrag.js.map