let $ = require ('jquery')

import  {slider1, model1} from '../view.js'
import  {setParameter} from '../controller.js'

const parentElementSlider = '.container1';
const parentElementPanel = '.containerPanel1';
const parentId = $(parentElementPanel).attr('id');
const slider = slider1;
const model = model1;

//Проверка на создание элементов слайдера
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

describe("Проверка минимального значения", function () {

  it("Позиция слайдера установлена верно", function () {
    if($(`#position-${parentId}`)){
      assert.equal($(`#position-${parentId}`).prop("checked"), ($(parentElementSlider).find('.scale').css('width') < $(parentElementSlider).find('.scale').css('height')));
    }
    else {
      assert.equal($(`#position-${parentId}`).prop("checked"), ($(parentElementSlider).find('.scale').css('width') < $(parentElementSlider).find('.scale').css('height')));
    }
  });

  it("Минимальное значение меньше, чем значения ручек и меньше максимального значения", function () {
    let value;
    if (model.oneThumb) {
      value = +model.value - 20;
    }
    else {
      value = +model.values[0] - 20;
    }
    $(`#min-${parentId}`).val(value);
    setParameter(model, document.getElementById(`min-${parentId}`), parentId, slider, parentElementSlider);
    assert.isOk($(parentElementSlider).find('p:first-child').text() === String(value));
  });

  it("Если минимальное значение больше, чем значение первой ручки, но меньше максимального значения, то значение первой ручки равно минимальному значению", function () {
    let value;
    let inputForThumb;
    if (model.oneThumb) {
      value = +model.value + 1;
    }
    else {
      value = +model.values[0] + 1;
    }
    $(`#min-${parentId}`).val(value);
    setParameter(model, document.getElementById(`min-${parentId}`), parentId, slider, parentElementSlider);
    if (model.oneThumb) {
      inputForThumb  = $(parentElementPanel).find(`#value-${parentId}`).val();
    }
    else {
      inputForThumb  = $(parentElementPanel).find(`#values1-${parentId}`).val();
    }
    assert.isOk(($(parentElementSlider).find('p:first-child').text() === String(model.minRange)) && (inputForThumb === String(model.minRange)));
  });

  it("Если минимальное значение больше, чем значение обеих ручек, то значение второй ручки равно максимальному значению", function () {
    let value = +model.values[1] + 1;
    $(`#min-${parentId}`).val(value);
    setParameter(model, document.getElementById(`min-${parentId}`), parentId, slider, parentElementSlider);
    let inputForThumb = $(parentElementPanel).find(`#values2-${parentId}`).val();
    assert.isOk(inputForThumb === String(model.maxRange));
  });

  it("Если значение минимума превышает значение максимума, то состояние слайдера не изменится", function () {
    let value = +model.maxRange + 1;
    $(`#min-${parentId}`).val(value);
    setParameter(model, document.getElementById(`min-${parentId}`), parentId, slider, parentElementSlider);
    console.log($(parentElementPanel).find(`#values2-${parentId}`).val())
    assert.isNotOk(($(parentElementSlider).find('p:first-child').text()) === ($(parentElementPanel).find(`#min-${parentId}`).val()));
  });
});

mocha.run();