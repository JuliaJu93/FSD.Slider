import $ from 'jquery'

export let inputsValue = {
    sliderWidth: 350, // Ширина шкалы (пиксели)
    positionHorizontal: true, // Позиция шкалы (true - если горизонтальная, false - если вертикальная)
    minRange: 0, // Минимальное значение шкалы
    maxRange: 200, // Максимальное значение шкалы
    oneThumb: false, // Количество ручек (true - если ручка одна, false - если их несколько)
    values: [50, 140], // Интервал по умолчанию для шкалы с двумя ручками
    value: 30, // Значение по умолчанию для шкалы с одной ручкой
    step: 10, // Шаг движения ручки
    elementText: true, // Элемент над ручкой
};

export let i = {
    sliderWidth: 220, // Ширина шкалы (пиксели)
    positionHorizontal: false, // Позиция шкалы (true - если горизонтальная, false - если вертикальная)
    minRange: 0, // Минимальное значение шкалы
    maxRange: 100, // Максимальное значение шкалы
    oneThumb: true, // Количество ручек (true - если ручка одна, false - если их несколько)
    values: [34, 90], // Интервал по умолчанию для шкалы с двумя ручками
    value: 50, // Значение по умолчанию для шкалы с одной ручкой
    step: 20, // Шаг движения ручки
    elementText: true, // Элемент над ручкой
};

//Создание ползунка
class ControlPanel {
    constructor(name) {
      this.name = name;
    }
    CreateControlPanel(parentElement, nameModel) {
        $(parentElement).append($('<div class="containerRow"></div>'));
        $(parentElement).find(".containerRow:first-child").append($('<label for="position"></label>'));
        $(parentElement).find(".containerRow:first-child label").text('Position horizontal');
        $(parentElement).find(".containerRow:first-child ").append($('<input type=checkbox id="position"></input>'));

        $(parentElement).append($('<div class="containerRow"></div>'));
        $(parentElement).find(".containerRow:nth-child(2)").append($('<label for="min"></label>'));
        $(parentElement).find(".containerRow:nth-child(2) label").text('Minimum value');
        $(parentElement).find(".containerRow:nth-child(2)").append($('<input id="min" type=number value=0 min=0></input>'));

        $(parentElement).append($('<div class="containerRow"></div>'));
        $(parentElement).find(".containerRow:nth-child(3)").append($('<label for="max"></label>'));
        $(parentElement).find(".containerRow:nth-child(3) label").text('Maximum value');
        $(parentElement).find(".containerRow:nth-child(3)").append($('<input id="max" type=number value=0 min=0></input>'));

        $(parentElement).append($('<div class="containerRow"></div>'));
        $(parentElement).find(".containerRow:nth-child(4)").append($('<label for="thumb"></label>'));
        $(parentElement).find(".containerRow:nth-child(4) label").text('One thumb');
        $(parentElement).find(".containerRow:nth-child(4)").append($('<input id="thumb" type=checkbox></input>'));

        $(parentElement).append($('<div class="containerRow"></div>'));
        $(parentElement).find(".containerRow:nth-child(5)").append($('<label for="value"></label>'));
        $(parentElement).find(".containerRow:nth-child(5) label").text('Value thumb');
        $(parentElement).find(".containerRow:nth-child(5)").append($('<input id="value" type=number value=0 min=0></input>'));

        $(parentElement).append($('<div class="containerRow"></div>'));
        $(parentElement).find(".containerRow:nth-child(6)").append($('<label for="Values"></label>'));
        $(parentElement).find(".containerRow:nth-child(6) label").text('Values thumbs');
        $(parentElement).find(".containerRow:nth-child(6)").append($('<input id="Values" type=number value=0 min=0></input>'));
        $(parentElement).find(".containerRow:nth-child(6)").append($('<input type=number value=0 min=0></input>'));

        $(parentElement).append($('<div class="containerRow"></div>'));
        $(parentElement).find(".containerRow:nth-child(7)").append($('<label for="Step"></label>'));
        $(parentElement).find(".containerRow:nth-child(7) label").text('Step');
        $(parentElement).find(".containerRow:nth-child(7)").append($('<input id="Step" type=number value=0 min=0></input>'));

        $(parentElement).append($('<div class="containerRow"></div>'));
        $(parentElement).find(".containerRow:nth-child(8)").append($('<label for="text"></label>'));
        $(parentElement).find(".containerRow:nth-child(8) label").text('Value above the thumb');
        $(parentElement).find(".containerRow:nth-child(8)").append($('<input id="text" type=checkbox></input>'));
    }
  }
  
  new ControlPanel ('panel1').CreateControlPanel(".containerPanel1", inputsValue);