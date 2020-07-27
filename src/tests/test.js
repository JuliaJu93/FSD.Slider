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

describe("Проверка правильности положения слайдера", function () {

  it("Вертикальная позиция устанавлиается верно", function () {
    $(`#position-${parentId}`).attr('checked', false);
    setParameter(model, document.getElementById(`position-${parentId}`), parentId, slider, parentElementSlider);
    assert.isOk(($(parentElementSlider).find('.scale').css('width') > $(parentElementSlider).find('.scale').css('height')));
  });

  it("Горизонтальная позиция устанавлиается верно", function () {
    $(`#position-${parentId}`).attr('checked', true);
    setParameter(model, document.getElementById(`position-${parentId}`), parentId, slider, parentElementSlider);
    assert.isOk(($(parentElementSlider).find('.scale').css('width') < $(parentElementSlider).find('.scale').css('height')));
  });

});

describe("Проверка минимального значения", function () {

  it("Минимальное значение меньше, чем значения ручек и меньше максимального значения", function () {
    let value;
    if (model.oneThumb) {
      value = model.minRange - model.value;
    }
    else {
      value = model.minRange - model.value;
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

  it("Если значение минимума превышает значение максимума, то минимальное значение будет равняться 0", function () {
    let value = +model.maxRange + 1;
    $(`#min-${parentId}`).val(value);
    setParameter(model, document.getElementById(`min-${parentId}`), parentId, slider, parentElementSlider);
    assert.isOk(($(parentElementSlider).find('p:first-child').text()) === '0');
  });
});

describe("Проверка максимального значения", function () {

  it("Максимальное значение больше, чем значения ручек и больше максимального значения", function () {
    let value;
    if (model.oneThumb) {
      value = +model.maxRange + +model.value;
    }
    else {
      value = +model.maxRange + +model.values[0];
    }
    $(`#max-${parentId}`).val(value);
    setParameter(model, document.getElementById(`max-${parentId}`), parentId, slider, parentElementSlider);
    assert.isOk($(parentElementSlider).find('p:last-child').text() === String(value));
  });

  it("Если максимальное значение меньше, чем значение второй ручки, но больше минимального значения, то значение второй ручки равно максимальному значению", function () {
    let value;
    let inputForThumb;
    if (model.oneThumb) {
      value = +model.value - 1;
    }
    else {
      value = +model.values[0] - 1;
    }
    $(`#max-${parentId}`).val(value);
    setParameter(model, document.getElementById(`max-${parentId}`), parentId, slider, parentElementSlider);
    if (model.oneThumb) {
      inputForThumb  = $(parentElementPanel).find(`#value-${parentId}`).val();
    }
    else {
      inputForThumb  = $(parentElementPanel).find(`#values2-${parentId}`).val();
    }
    assert.isOk(($(parentElementSlider).find('p:last-child').text() === String(model.maxRange)) && (inputForThumb === String(model.maxRange)));
  });

  it("Если максимальное значение меньше, чем значение обеих ручек, то значение первой ручки равно миниальному значению", function () {
    let value = +model.values[0] - 10;
    $(`#max-${parentId}`).val(value);
    setParameter(model, document.getElementById(`max-${parentId}`), parentId, slider, parentElementSlider);
    let inputForThumb = $(parentElementPanel).find(`#values1-${parentId}`).val();
    assert.isOk(inputForThumb === String(model.minRange));
  });

  it("Если значение максимума меньше значения минимума, то максимальное значение будет все равно выставляться больше, чем минимальное значение", function () {
    let value = +model.maxRange + 10;
    $(`#min-${parentId}`).val(value);
    setParameter(model, document.getElementById(`min-${parentId}`), parentId, slider, parentElementSlider);
    assert.isOk(model.maxRange > model.minRange);
  });
});

mocha.run();