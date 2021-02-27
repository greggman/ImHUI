import { queueUpdate } from './core.js';
import * as ImHUI from './ImHUI.js';
import {settings} from './background.js';

const data = {
  str: 'foobar 😎☀🌴🍹',
  v: 0.5,
  vd: 0.5,
  my_tool_active: true,
  my_first_tool: true,
  my_color: [0.9, 0.7, 0.5, 1.0],
  my_values: new Array(120).fill(0),
  my_random: new Array(120).fill(0),
};

function gs(obj: any, prop: string) {
  return {
    get() { return obj[prop]; },
    set(v: any) { obj[prop] = v; }
  };
}

function g(prop: string) {
  return gs(data, prop);
}

function renderUI() {
  ImHUI.start();

  ImHUI.begin("Test Window", g('my_first_active'), 'MenuBar');
    ImHUI.text(`Hello, world 🌐 ${123}`);
    if (ImHUI.button("Save")) {
      console.log('save');
    }
    ImHUI.inputText("string", g('str'));
    ImHUI.sliderFloat("float", g('v'), 0, 5);
    ImHUI.inputText("string", g('str'));
    ImHUI.sliderFloat("float", g('v'), 0, 15);

    ImHUI.text(`The string is: ${data.str}`);
    ImHUI.text(`The float is: float ${data.v}`);

    ImHUI.colorEdit4("Background Color", gs(settings, 'clearColor'));
    ImHUI.sliderFloat("Vertex Count", gs(settings, 'vertexCount'), 0, 100000);

  ImHUI.end();

  // ---

  ImHUI.begin("My First Tool", g('my_tool_active'), 'MenuBar');
  if (ImHUI.beginMenuBar())
  {
      if (ImHUI.beginMenu("File"))
      {
          if (ImHUI.menuItem("Open..", "Ctrl+O")) { /* Do stuff */ }
          if (ImHUI.menuItem("Save", "Ctrl+S"))   { /* Do stuff */ }
          if (ImHUI.menuItem("Close", "Ctrl+W"))  { data.my_tool_active = false; }
          ImHUI.endMenu();
      }
      ImHUI.endMenuBar();
  }

  // Edit a color (stored as ~4 floats)
  ImHUI.colorEdit4("Color", g('my_color'));

  // Plot some values
  ImHUI.plotLines("Frame Times", data.my_values, 0, 1000 / 30);
  ImHUI.plotLines("Sine Wave", data.my_random, -1.1, 1.1);

  // Display contents in a scrolling region
  ImHUI.textColored('yellow', "Important Stuff");
  ImHUI.beginChild("Scrolling");
  for (let n = 0; n < 50; n++)
      ImHUI.text(`${n.toString().padStart(4, '0')}: Some text`);
  ImHUI.endChild();
  ImHUI.end();


  ImHUI.finish();
}

ImHUI.setup(document.querySelector('#root'), renderUI);

function r(min: number, max?: number) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.random() * (max - min) + min;
}

function shiftArray(array: any[], v: any) {
  array.push(v);
  array.shift();
}

let then = 0;
function render(now: number) {
  const elapsedTime = now - then;
  shiftArray(data.my_values, elapsedTime);
  then = now;

  shiftArray(data.my_random, Math.sin(now * 0.01));

  queueUpdate();

  requestAnimationFrame(render);
}

requestAnimationFrame(render);