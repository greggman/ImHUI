import * as ImHUI from './ImHUI.js';
const data = {
    str: 'foobar 😎☀🌴🍹',
    v: 0.5,
    vd: 0.5,
    my_tool_active: true,
    my_color: [0.9, 0.7, 0.5, 1.0],
    my_values: [0.2, 0.1, 1.0, 0.5, 0.9, 2.2],
};
function gs(obj, prop) {
    return {
        get() { return obj[prop]; },
        set(v) { obj[prop] = v; }
    };
}
function g(prop) {
    return gs(data, prop);
}
function renderUI() {
    ImHUI.start();
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
    // ---
    ImHUI.begin("My First Tool", g('my_tool_active'), 'MenuBar');
    if (ImHUI.beginMenuBar()) {
        if (ImHUI.beginMenu("File")) {
            if (ImHUI.menuItem("Open..", "Ctrl+O")) { /* Do stuff */ }
            if (ImHUI.menuItem("Save", "Ctrl+S")) { /* Do stuff */ }
            if (ImHUI.menuItem("Close", "Ctrl+W")) {
                data.my_tool_active = false;
            }
            ImHUI.endMenu();
        }
        ImHUI.endMenuBar();
    }
    // Edit a color (stored as ~4 floats)
    ImHUI.colorEdit4("Color", g('my_color'));
    // Plot some values
    ImHUI.plotLines("Frame Times", data.my_values);
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
//# sourceMappingURL=main.js.map