import { queueUpdate } from './core.js';
import * as ImHUI from './ImHUI.js';
import { settings } from './background.js';
import { beginWrapper, endWrapper } from './child.js';
const data = {
    str: 'foobar 😎☀🌴🍹',
    v: 0.5,
    vd: 0.5,
    fps: 0,
    myColor: [0.9, 0.7, 0.5, 1.0],
    myValues: new Array(120).fill(0),
    myRandom: new Array(120).fill(0),
};
const smallWindowSettings = { title: "Small Test Window", active: true };
const testWindowSettings = { title: "Test Window", active: true };
const toolWindowSettings = { title: "My First Tool", active: true };
const values = [1, 2];
function smallTestWindow() {
    ImHUI.begin(smallWindowSettings);
    ImHUI.text("Window Settings:");
    ImHUI.text(`  left  : ${smallWindowSettings.rect.left}`);
    ImHUI.text(`  top   : ${smallWindowSettings.rect.top}`);
    ImHUI.text(`  width : ${smallWindowSettings.rect.width}`);
    ImHUI.text(`  height: ${smallWindowSettings.rect.height}`);
    ImHUI.separator();
    if (ImHUI.button("Add Value")) {
        values.push(Math.random());
    }
    for (let i = 0; i < values.length; ++i) {
        beginWrapper('value-line');
        values[i] = ImHUI.sliderFloat(`${i}`, values[i], 0, 10);
        if (ImHUI.button('✖')) {
            values.splice(i, 1);
            --i;
        }
        endWrapper();
    }
    ImHUI.plotLines('values', values, 0, 10);
    ImHUI.end();
}
function testWindow() {
    ImHUI.begin(testWindowSettings);
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
}
function toolWindow() {
    ImHUI.begin(toolWindowSettings);
    if (ImHUI.beginMenuBar()) {
        if (ImHUI.beginMenu("File")) {
            if (ImHUI.menuItem("Open..", "Ctrl+O")) {
                console.log('open');
            }
            if (ImHUI.menuItem("Save", "Ctrl+S")) {
                console.log('save');
            }
            if (ImHUI.menuItem("Close", "Ctrl+W")) {
                toolWindowSettings.active = false;
            }
            ImHUI.endMenu();
        }
        ImHUI.endMenuBar();
    }
    // Edit a color (stored as ~4 floats)
    ImHUI.colorEdit4("Color", data.myColor);
    ImHUI.text(`fps: ${data.fps.toFixed(1)}`);
    // Plot some values
    ImHUI.plotLines("Frame Times", data.myValues, 0, 1000 / 30);
    ImHUI.plotLines("Sine Wave", data.myRandom, -1.1, 1.1);
    // Display contents in a scrolling region
    ImHUI.textColored('yellow', "Important Stuff");
    ImHUI.beginChild("Scrolling");
    for (let n = 0; n < 50; n++)
        ImHUI.text(`${n.toString().padStart(4, '0')}: Some text`);
    ImHUI.endChild();
    ImHUI.end();
}
function renderUI() {
    ImHUI.start();
    smallTestWindow();
    testWindow();
    toolWindow();
    ImHUI.finish();
}
ImHUI.setup(document.querySelector('#root'), renderUI);
function r(min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return Math.random() * (max - min) + min;
}
function shiftArray(array, v) {
    array.push(v);
    array.shift();
}
let then = 0;
function render(now) {
    const elapsedTime = now - then;
    data.fps = 1000 / elapsedTime;
    shiftArray(data.myValues, elapsedTime);
    then = now;
    shiftArray(data.myRandom, Math.sin(now * 0.01));
    queueUpdate();
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
//# sourceMappingURL=main.js.map