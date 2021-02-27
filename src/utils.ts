export function e(tag: string, attrs = {}, children: (HTMLElement|string)[] = []): HTMLElement { 
  const elem = <any>document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) {
        elem[key][k] = v;
      }
    } else if (elem[key] === undefined) {
      elem.setAttribute(key, value);
    } else {
      elem[key] = value;
    }
  }
  if (Array.isArray(children)) {
    for (const child of children) {
      if (typeof child === 'string') {
        elem.appendChild(document.createTextNode(child));
      } else {
        elem.appendChild(child);
      }
    }
  } else {
    elem.textContent = children;
  }
  return elem;
}

export function clamp(v: number, min: number = 0, max: number = 1): number {
  return Math.min(Math.max(v, min), max);
}