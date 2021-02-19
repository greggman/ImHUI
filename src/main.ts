import * as ImHTML from './ImHTML.js';

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
  ImHTML.start();
  ImHTML.text(`Hello, world ${123}`);
  if (ImHTML.button("Save")) {
    console.log('save');
  }
  ImHTML.inputText("string", gs(data, 'str'));
  ImHTML.sliderFloat("float", gs(data, 'v'), 0, 5);
  ImHTML.inputText("string", gs(data, 'str'));
  ImHTML.sliderFloat("float", gs(data, 'v'), 0, 15);

  ImHTML.text(`string ${data.str}`);
  ImHTML.text(`float ${data.v}`);

  ImHTML.finish();
}

ImHTML.setup(document.querySelector('#root'), renderUI);
