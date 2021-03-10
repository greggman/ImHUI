# ImHUI (**I**mmediate **M**ode **H**TML **U**ser **I**nterface)

[Live Demo](https://greggman.github.io/ImHUI)

**WAT?** I'm a fan (and a sponsor) of [Dear ImGUI](https://github.com/ocornut/imgui). I've written a couple of articles on it including [this one](https://games.greggman.com/game/imgui-future/) and [this one](https://games.greggman.com/game/rethinking-ui-apis/)

Lately I thought, I wonder what it would be like to try to make an
HTML library that followed a similar style of API.

NOTE: This is not Dear ImGUI running in JavaScript. For that see
[this repo](https://github.com/flyover/imgui-js). The difference
is most ImGUI libraries render their own graphics. More specifically
they generate arrays of vertex positions, texture coordinates, and
vertex colors for the glyphs and other lines and rectangles for your
UI. You draw each array of vertices using whatever method you feel like.

This repo is instead actually using HTML elements like `<div>`
`<input type="text">`, `<input type="range">`, `<button>` etc...

This has pluses and minus. 

The minus is it's likely not as fast as Dear ImGUI (or other ImGUI)
libraries, especially if you've got a complex UI that updates at 60fps.
On the other hand it might actually be faster for certain cases.

The pluses are

* If you don't update anything in the UI it doesn't use any CPU

* Styling is free (use CSS)

  Most ImGUI libraries have very minimal styling features.

* Layout is free (word wrap, sizing, grids, spacing

  Most layout happen outside the library based on css

* Supports all of Unicode

  Most ImGUI libraries only handle a small number of glyphs.
  They may or may not handle colored emoji 🍎🍐🍇🐯🐻🦁👾😉🤣
  or Japanese(日本語), Korean(한국어), Chinese(汉语). I don't think
  any handle right to left languages like Arabic(عربي).

* Supports more fonts

  This might not be fair, I'm sure Dear ImGUI can use more than one
  font. The thing is it's likely cumbersome, especially multiple
  sizes in multiple styles where as the browser excels at this.

* Supports Language Input

  Many ImGUI libraries have issues with language input. Because they
  are rendering their own text they have 2nd class support for
  complex input.

* Supports Accessability

  Most ImGUI libraries are not very accessability friendly. Because
  they just ultimately render pixels there is not much for an accessability
  feature to look at. With HTML, it's far easier for the browser
  and or OS to look into the content of the elements.

* Automatic zoom support

  The browser zooms. No work required on your part

* Automatic HD-DPI support

  The browser will render text and most other widgets taking into
  account the user's device's HD-DPI features.

* In general, less code than Dear ImGUI should be executing if you are not updating
  1000s of values per frame.

  Consider, Dear ImGUI is mostly stateless AFAIK. That means things like word
  wrapping a string or computing the size of column might need to be done on
  every render. In ImHUI's case, that's handled by the browser and if the contents
  of an element has not changed much of that is cached.

# WARNING!!!

## **This is an experiment!!**

It is not meant to be used for actual projects (yet?). I'm just trying it
out, starting with the small snippets of Dear ImGUI demo code and converting
it to use this library to see if it's possible.

I'm curious where it will lead, what tradeoffs there are, also what
good parts of Dear ImGUI come from the concept of an ImGUI vs just
come from the fact that the other wrote some nice tools you can build
on.

There are lots of issues. It is **NOT READY TO USED IN OTHER PROJECTS**

## **Requires ES2019**

At the moment no effort has been made to make it run on anything other
than 2021 browsers, Chromium based in particular (meaning I have not tested
anywhere else).

# LICENSE: MIT
