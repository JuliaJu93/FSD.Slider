let $ = require ('jquery')

import  {slider1} from '../view.js'

let parentElementSlider = '.container1';
let parentElementPanel = '.containerPanel1';

describe("Слайдер", function () {

  it("Контейнер для слайдера был создан", function() {
    assert.isOk(document.querySelector(`${parentElementSlider} .containerOfSlider`));
  });

  it("Шкала слайдера была создана", function () {
    assert.isOk(document.querySelector(`${parentElementSlider} .scale`));
  });

  it("Шкала значений под слайдером была создана", function () {
    assert.isOk(document.querySelector(`${parentElementSlider} .scaleOfValues`));
  });

  it("Ручки были созданы", function () {
    assert.isOk(document.querySelector(`${parentElementSlider} .thumb`));
  });

});

// describe("Панель управления", function () {

//   it("Позиция слайдера установлена верно", function () {
//     assert.equal(document.querySelector('.containerOfSlider'));
//   });

//   it("Шкала слайдера была создана", function () {
//     assert.isOk(document.querySelector('.scale'));
//   });

//   it("Шкала значений под слайдером была создана", function () {
//     assert.isOk(document.querySelector('.scaleOfValues'));
//   });

//   it("Ручки были созданы", function () {
//     assert.isOk(document.querySelector('.thumb'));
//   });

// });

mocha.run();