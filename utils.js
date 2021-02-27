export function e(tag, attrs = {}, children = []) {
    const elem = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
        if (typeof value === 'object') {
            for (const [k, v] of Object.entries(value)) {
                elem[key][k] = v;
            }
        }
        else if (elem[key] === undefined) {
            elem.setAttribute(key, value);
        }
        else {
            elem[key] = value;
        }
    }
    if (Array.isArray(children)) {
        for (const child of children) {
            if (typeof child === 'string') {
                elem.appendChild(document.createTextNode(child));
            }
            else {
                elem.appendChild(child);
            }
        }
    }
    else {
        elem.textContent = children;
    }
    return elem;
}
export function clamp(v, min = 0, max = 1) {
    return Math.min(Math.max(v, min), max);
}
export function resizeCanvasToDisplaySize(canvas) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = width !== canvas.width || height !== canvas.height;
    if (needResize) {
        canvas.width = width;
        canvas.height = height;
    }
    return needResize;
}
//# sourceMappingURL=utils.js.map