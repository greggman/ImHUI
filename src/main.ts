import { queueUpdate } from './core.js';
import * as ImHUI from './ImHUI.js';
import {settings} from './background.js';

const data = {
  str: 'foobar 😎☀🌴🍹',
  v: 0.5,
  vd: 0.5,
  my_tool_active: true,
  my_first_tool: true,
  fps: 0,
  my_color: [0.9, 0.7, 0.5, 1.0],
  my_values: new Array(120).fill(0),
  my_random: new Array(120).fill(0),
};

function renderUI() {
  ImHUI.start();

  data.my_first_tool = ImHUI.begin("Test Window", data.my_first_tool, 'MenuBar');
    ImHUI.text(`Hello, world 🌐 ${123}`);
    if (ImHUI.button("Save")) {
      console.log('save');
    }
    data.str = ImHUI.inputText("string", data.str);
    data.v = ImHUI.sliderFloat("float", data.v, 0, 5);
    data.str = ImHUI.inputText("string", data.str);
    data.v = ImHUI.sliderFloat("float", data.v, 0, 15);

    ImHUI.text(`The string is: ${data.str}`);
    ImHUI.text(`The float is: float ${data.v}`);

    ImHUI.colorEdit4("Background Color", settings.clearColor);
    settings.vertexCount = ImHUI.sliderFloat("Vertex Count", settings.vertexCount, 0, 100000);

  ImHUI.end();

  // ---

  data.my_tool_active = ImHUI.begin("My First Tool", data.my_tool_active, 'MenuBar');
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
  ImHUI.colorEdit4("Color", data.my_color);

  ImHUI.text(`fps: ${data.fps.toFixed(1)}`);

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
  data.fps = 1000 / elapsedTime;
  shiftArray(data.my_values, elapsedTime);
  then = now;

  shiftArray(data.my_random, Math.sin(now * 0.01));

  queueUpdate();

  requestAnimationFrame(render);
}

requestAnimationFrame(render);