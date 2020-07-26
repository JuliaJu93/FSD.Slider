let $ = require ('jquery')

import  {slider1, model1} from '../view.js'
import  {setParameter} from '../controller.js'

const parentElementSlider = '.container1';
const parentElementPanel = '.containerPanel1';
const parentId = $(parentElementPanel).attr('id');

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

describe("Панель управления", function () {

  it("Позиция слайдера установлена верно", function () {
    if($(`#position-${parentId}`)){
      assert.equal($(`#position-${parentId}`).prop("checked"), ($(parentElementSlider).find('.scale').css('width') < $(parentElementSlider).find('.scale').css('height')));
    }
    else {
      assert.equal($(`#position-${parentId}`).prop("checked"), ($(parentElementSlider).find('.scale').css('width') < $(parentElementSlider).find('.scale').css('height')));
    }
  });

  it("Проверка минимального значения", function () {
    $(`#min-${parentId}`).val('45');
    setParameter(model1, document.getElementById(`min-${parentId}`), parentId, slider1, parentElementSlider);
    assert.isOk();
  });

  it("Шкала значений под слайдером была создана", function () {
    assert.isOk(document.querySelector('.scaleOfValues'));
  });

  it("Ручки были созданы", function () {
    assert.isOk(document.querySelector('.thumb'));
  });

});

mocha.run();