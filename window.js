import { e } from './utils.js';
import { Node, Context, context, queueUpdate } from './core.js';
let windowCount = 0;
export class WrapperNode extends Node {
    constructor(type, className, value) {
        super(type);
        this.end = () => {
            Context.popContext();
        };
        this.setClassName(className);
        this.#detailsElem = this.elem;
        this.#context = new Context(this.elem, this.end);
        this.#detailsElem.addEventListener('click', (e) => {
            this.#value = this.#detailsElem.open;
            this.#haveNewValue = true;
            queueUpdate();
        });
    }
    #context;
    #detailsElem;
    #value;
    #haveNewValue;
    update(value) {
        if (this.#haveNewValue) {
            value = this.#value;
        }
        else {
            if (this.#value !== value) {
                this.#detailsElem.open = !!this.#value;
            }
        }
        return value;
    }
    begin() {
        Context.pushContext(this.#context);
    }
}
function px(v) {
    return `${v | 0}px`;
}
function addMoveHandlers(elem) {
}
function areRectsEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (!a || !b) {
        return false;
    }
    return a.left === b.left &&
        a.top === b.top &&
        a.width === b.width &&
        a.height === b.height;
}
export class WindowNode extends Node {
    constructor(settings) {
        super('div');
        this.end = () => {
            if (this.#needSize) {
                this.#needSize = false;
                if (this.#settings.rect.width === undefined) {
                    this.#settings.rect.width = this.#windowElem.scrollWidth;
                    this.#haveNewSettings = true;
                }
                // FIX: remove the 6
                this.#settings.rect.height = this.#windowElem.scrollHeight + 6;
                this.#haveNewSettings = true;
            }
            Context.popContext();
        };
        this.#summaryElem = e('summary');
        this.#detailsElem = e('details', { open: true }, [
            this.#summaryElem,
        ]);
        this.#windowElem = e('div', { className: 'window layout-scrollbar' }, [
            this.#detailsElem,
        ]);
        this.#settings = { rect: {} };
        if (!settings.rect) {
            settings.rect = {};
        }
        if (settings.rect.left === undefined) {
            settings.rect.left = 10 + (windowCount * 25) % Math.max(window.innerWidth - 300, 10);
            settings.rect.top = 10 + (windowCount * 25) % Math.max(window.innerHeight - 300, 10);
            ++windowCount;
        }
        if (settings.rect.width === undefined) {
            settings.rect.width = 400;
        }
        if (settings.rect.height === undefined) {
            this.#needSize = true;
        }
        const elem = this.#windowElem;
        let mouseStartX;
        let mouseStartY;
        let elemStartX;
        let elemStartY;
        const onMouseMove = (e) => {
            const deltaX = e.clientX - mouseStartX;
            const deltaY = e.clientY - mouseStartY;
            const rect = this.#settings.rect;
            rect.left = elemStartX + deltaX;
            rect.top = elemStartY + deltaY;
            this.#windowElem.style.left = px(rect.left);
            this.#windowElem.style.top = px(rect.top);
            this.#haveNewSettings = true;
        };
        const onMouseUp = (e) => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
        this.#summaryElem.addEventListener('mousedown', (e) => {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            mouseStartX = e.clientX;
            mouseStartY = e.clientY;
            const rect = elem.getBoundingClientRect();
            elemStartX = rect.left | 0;
            elemStartY = rect.top | 0;
        });
        this.#summaryElem.addEventListener('click', (e) => {
            //if (e.offsetX > 20) {
            e.preventDefault();
            //}
            /*
            this.#settings.active = !this.#settings.active;
            this.#haveNewSettings = true;
            */
        });
        // FIX: We shouldn't use css:resize and resize observer.
        // we should instead handle this ourselves
        const onResize = () => {
            if (!this.#haveNewSettings) {
                const rect = this.#windowElem.getBoundingClientRect();
                this.#settings.rect.width = rect.width;
                this.#settings.rect.height = rect.height;
                this.#haveNewSettings = true;
            }
        };
        const resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe(this.#windowElem);
        // FIX: should probably go through some API, not directly to document
        // document.body.appendChild(this.#windowElem);
        // append to root so we can get better scrollbars
        document.querySelector('#root').appendChild(this.#windowElem);
        // FIX: this is a place holder because Node requires one
        this.#context = new Context(this.#detailsElem, this.end);
        this.#detailsElem.addEventListener('click', (e) => {
            if (e.clientX > 20) {
                e.preventDefault();
            }
            queueUpdate();
        });
    }
    #context;
    #windowElem;
    #detailsElem;
    #summaryElem;
    #settings;
    #haveNewSettings;
    #needSize;
    remove() {
        super.remove();
        this.#windowElem.remove();
    }
    update(settings) {
        if (this.#haveNewSettings) {
            this.#haveNewSettings = false;
            // FIX: got to be a better way
            const rect = settings.rect;
            Object.assign(settings, this.#settings);
            settings.rect = rect;
            Object.assign(rect, this.#settings.rect);
            this._updateRect();
        }
        else {
            {
                const title = settings.title;
                if (this.#settings.title !== title) {
                    this.#settings.title = title;
                    this.#summaryElem.textContent = title;
                }
            }
            {
                const active = settings.active;
                if (this.#settings.active !== active) {
                    this.#settings.active = active;
                    this.#detailsElem.open = !!active;
                    this._updateRect();
                }
            }
            {
                const rect = settings.rect;
                if (!areRectsEqual(rect, this.#settings.rect)) {
                    {
                        const displayRect = this.#windowElem.getBoundingClientRect();
                        rect.left = rect.left === undefined ? displayRect.left : rect.left;
                        rect.top = rect.top === undefined ? displayRect.top : rect.top;
                        rect.width = rect.width === undefined ? displayRect.width : rect.width;
                        rect.height = rect.height === undefined ? displayRect.height : rect.height;
                    }
                    Object.assign(this.#settings.rect, rect);
                    this._updateRect();
                }
            }
        }
    }
    _updateRect() {
        const rect = this.#settings.rect;
        this.#windowElem.style.width = px(rect.width);
        this.#windowElem.style.height = this.#settings.active ? px(rect.height) : '';
        this.#windowElem.style.left = px(rect.left);
        this.#windowElem.style.top = px(rect.top);
    }
    begin() {
        Context.pushContext(this.#context);
    }
}
export function begin(settings) {
    const node = context.getExistingNodeOrRemove(WindowNode, settings);
    node.update(settings);
    node.begin();
}
export function end() {
    // Magic happen here. The context has a finish function registered
    // by WindowNode.
    context.finish();
}
//# sourceMappingURL=window.js.map