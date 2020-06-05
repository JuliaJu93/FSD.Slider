import $ from 'jquery'

export let inputsValue = {
    sliderWidth: 400, // Ширина шкалы (пиксели)
    positionHorizontal: true, // Позиция шкалы (true - если горизонтальная, false - если вертикальная)
    minRange: 100, // Минимальное значение шкалы
    maxRange: 200, // Максимальное значение шкалы
    oneThumb: true, // Количество ручек (true - если ручка одна, false - если их несколько)
    values: [120, 190], // Интервал по умолчанию для шкалы с двумя ручками
    value: 170, // Значение по умолчанию для шкалы с одной ручкой
    step: 50, // Шаг движения ручки
    elementText: true, // Элемент над ручкой
};

export let i = {
    sliderWidth: 200, // Ширина шкалы (пиксели)
    positionHorizontal: false, // Позиция шкалы (true - если горизонтальная, false - если вертикальная)
    minRange: 20, // Минимальное значение шкалы
    maxRange: 100, // Максимальное значение шкалы
    oneThumb: false, // Количество ручек (true - если ручка одна, false - если их несколько)
    values: [34, 90], // Интервал по умолчанию для шкалы с двумя ручками
    value: 50, // Значение по умолчанию для шкалы с одной ручкой
    step: 1, // Шаг движения ручки
    elementText: true, // Элемент над ручкой
};

//Создание ползунка
class ControlPanel {
    constructor(name) {
      this.name = name;
    }
    CreateControlPanel(parentElement, nameModel) {
        const parentId =  $(parentElement).attr('id');

        $(parentElement).append($('<div class="containerRow"></div>'));
        $(parentElement).find(".containerRow:first-child").append($(`<label for='position-${parentId}'></label>`));
        $(parentElement).find(".containerRow:first-child label").text('Position horizontal');
        let position; 
        if (nameModel.positionHorizontal){
            position = 'checked';
        }
        $(parentElement).find(".containerRow:first-child ").append($(`<input type=checkbox id='position-${parentId}' ${position}></input>`));

        $(parentElement).append($('<div class="containerRow"></div>'));
        $(parentElement).find(".containerRow:nth-child(2)").append($(`<label for="min-${parentId}"></label>`));
        $(parentElement).find(".containerRow:nth-child(2) label").text('Minimum value');
        $(parentElement).find(".containerRow:nth-child(2)").append($(`<input id="min-${parentId}" type=number value=${nameModel.minRange} min=0></input>`));

        $(parentElement).append($('<div class="containerRow"></div>'));
        $(parentElement).find(".containerRow:nth-child(3)").append($(`<label for="max-${parentId}"></label>`));
        $(parentElement).find(".containerRow:nth-child(3) label").text('Maximum value');
        $(parentElement).find(".containerRow:nth-child(3)").append($(`<input id="max-${parentId}" type=number value=${nameModel.maxRange} min=0></input>`));

        $(parentElement).append($('<div class="containerRow"></div>'));
        $(parentElement).find(".containerRow:nth-child(4)").append($(`<label for="thumb-${parentId}"></label>`));
        $(parentElement).find(".containerRow:nth-child(4) label").text('One thumb');
        let thumb; 
        if (nameModel.oneThumb){
            thumb = 'checked';
        }
        $(parentElement).find(".containerRow:nth-child(4)").append($(`<input id="thumb-${parentId}" type=checkbox ${thumb}></input>`));

        $(parentElement).append($('<div class="containerRow"></div>'));
        $(parentElement).find(".containerRow:nth-child(5)").append($(`<label for="value-${parentId}"></label>`));
        $(parentElement).find(".containerRow:nth-child(5) label").text('Value thumb');
        $(parentElement).find(".containerRow:nth-child(5)").append($(`<input id="value-${parentId}" type=number value=${nameModel.value} min=0></input>`));

        $(parentElement).append($('<div class="containerRow"></div>'));
        $(parentElement).find(".containerRow:nth-child(6)").append($(`<label for="values-${parentId}"></label>`));
        $(parentElement).find(".containerRow:nth-child(6) label").text('Values thumbs');
        $(parentElement).find(".containerRow:nth-child(6)").append($(`<input id="values-${parentId}" type=number value=${nameModel.values[0]} min=0></input>`));
        $(parentElement).find(".containerRow:nth-child(6)").append($(`<input type=number value=${nameModel.values[1]} min=0></input>`));

        $(parentElement).append($('<div class="containerRow"></div>'));
        $(parentElement).find(".containerRow:nth-child(7)").append($(`<label for="step-${parentId}"></label>`));
        $(parentElement).find(".containerRow:nth-child(7) label").text('Step');
        $(parentElement).find(".containerRow:nth-child(7)").append($(`<input id="step-${parentId}" type=number value=${nameModel.step} min=0></input>`));

        $(parentElement).append($('<div class="containerRow"></div>'));
        $(parentElement).find(".containerRow:nth-child(8)").append($(`<label for="text-${parentId}"></label>`));
        $(parentElement).find(".containerRow:nth-child(8) label").text('Value above the thumb');
        let element; 
        if (nameModel.elementText){
            element = 'checked';
        }
        $(parentElement).find(".containerRow:nth-child(8)").append($(`<input id="text-${parentId}" type=checkbox ${element}></input>`));
    }
  }
  
  new ControlPanel ('panel1').CreateControlPanel(".containerPanel1", inputsValue);