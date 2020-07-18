let $ = require ('jquery')

import  {slider1} from '../view.js'

describe("create slider", function() {

  it("Контейнер для слайдера был создан", function() {
    assert.isOk(document.querySelector('.containerOfSlider'));
  });

  it("Шкала была создана", function() {
    assert.isOk(document.querySelector('.scale'));
  });

  it("Шкала значений была создана", function() {
    assert.isOk(document.querySelector('.scaleOfValues'));
  });

});

mocha.run();