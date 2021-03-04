# Development Notes

## How it works ATM

There is a hierarchy of `Node` (an internal type).
While rendering, we get existing nodes in the order they
were rendering last time. We compare the node we got to
the type of node we want. In other words, if we have top level
code like

```js
function renderUI() {
  text('Editor');
  speed = sliderFloat('speed', speed);
  title = inputText('title', title);
}
```

Then 3 `Node`s are generated, a `TextNode`, a `SliderFloatNode`, 
and a `InputTextNode` in that order

The next time through when we see `text('Editor')` we'll get
the first `Node` and check if it's a `TextNode`. If it is we'll
use it. It should function for any text and any things that need
to updated, should be updated in its `update` method.

If the node is node `TextNode` then it's discarded.

This probably means if you change a node near the top of a list
in the hierarchy then everything after it is going to be discarded
and regenerated. 

ATM that's fine just to get things working I think. In the future
we could consider a cache of unused nodes by type and/or some other
ways of optimizing churn.

## We need a way to know if a node can be reused

Guidelines

*  If you allow the user to set `className` then you're update function
   must set the className with `this.setClassName(className)`

*  Every part of an element you let a user change you have to check
   in `update` if it it's changed

*  If you allow the user to pass the element type then we need a way
   to pass that type all the way into `getExistingNodeOrRemove`
   so that it can check if an existing node of type X is covering
   an element if the required element type

   One idea. We could generate types by element type? Unfortunately
   that would not be typescript friendly?

```js
class TypeTextNode extends Node {
  #text: string;

  constructor(type: string) {
    // FIX! You can't pass the type OR we need to fix the code
    // that gets an old node because it checks by JS class instanceof
    // not by element type
    super(type);
  }
  update(str: string) {
    if (this.#text !== str) {
      this.#text = str;
      this.elem.textContent = str;
    }
  }
}

const elementTypeToConstructor = new Map();

/**
 * Makes one class inherit from another.
 * @param {!Object} subClass Class that wants to inherit.
 * @param {!Object} superClass Class to inherit from.
 */
function inherit(subClass, superClass) {
  /**
   * TmpClass.
   * @ignore
   * @constructor
   */
  const TmpClass = function() { };
  TmpClass.prototype = superClass.prototype;
  subClass.prototype = new TmpClass();
};

export function typeText(type: string, str: string) {
  let ctor = elementTypeToConstructor(type);
  if (!ctor) {
    ctor = function() {
      TextTypeNode.call(type);
    }
    inherit(ctor, TextTypeNode);
    elementTypeToConstructor.set(type, ctor)
  }

  // this is the iffy part VVVVV
  const node = context.getExistingNodeOrRemove<TypeTextNode>(ctor, type, str);
  node.update(str);
}
```

## Decide how to handle stateful stuff

Example: A window has the state of position and size.
We really need to expose that to the use. Suggestion
1 is by ID. (I think ImGUI does it that way). Suggestion
2 is have the user provide it.

Advantage to ID is it's opaque. What's saved is not up to the
user. Advantage to exposing it is user can set and save it.

For now going to try exposing