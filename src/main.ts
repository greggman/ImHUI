import * as ImHUI from './ImHUI.js';

const data = {
  str: 'foobar',
  v: 0.5,
};
function gs(obj: any, prop: string) {
  return {
    get() { return obj[prop]; },
    set(v: any) { obj[prop] = v; }
  };
}

function renderUI() {
  ImHUI.start();
  ImHUI.text(`Hello, world ${123}`);
  if (ImHUI.button("Save")) {
    console.log('save');
  }
  ImHUI.inputText("string", gs(data, 'str'));
  ImHUI.sliderFloat("float", gs(data, 'v'), 0, 5);
  ImHUI.inputText("string", gs(data, 'str'));
  ImHUI.sliderFloat("float", gs(data, 'v'), 0, 15);

  ImHUI.text(`string ${data.str}`);
  ImHUI.text(`float ${data.v}`);

  ImHUI.finish();
}

ImHUI.setup(document.querySelector('#root'), renderUI);
