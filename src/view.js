import $ from 'jquery'
import  {inputsValue, i, Model} from './model.js'

class Container {
  constructor(name) {
    this.name = name;
  }
  CreateContainer(parentElement, nameModel) {
    $(parentElement).append($('<div class="containerOfSlider"></div>'));
    const position = new Scale().ScalePosition(parentElement, nameModel);
    $(parentElement).find(".containerOfSlider").css('flex-direction', position[4]);
  }
}

//Создание Шкалы произвольной ширины, с возможностью изменять ее позицию (горизонтальная или вертикальная)
class Scale {
  constructor(name) {
    this.name = name;
  }
  CreateScale(parentElement, nameModel) {
    $(parentElement).find(".containerOfSlider").append($('<div class="scale"></div>'));
    const position = new Scale().ScalePosition(parentElement, nameModel);
    $(parentElement).find(".scale").css(position[2], nameModel.sliderWidth + 16);
  }
  // Параметры, которые зависят от положения шкалы
  ScalePosition(parentElement, nameModel) {
    let direction,
      margin,
      size,
      intervalPosition,
      positionContent,
      reversePosition,
      reverseSize;
    if (nameModel.positionHorizontal){
      direction = 'left';
      margin = 'margin-left';
      size = 'width';
      intervalPosition = $(parentElement).find(".interval").css('height', (100 + '%'));
      positionContent = 'column';
      reversePosition = 'row';
      reverseSize = 'height';
    }
    else {
      direction = 'top';
      margin = 'margin-top';
      size = 'height';
      intervalPosition = $(parentElement).find(".interval").css('width', (100 + '%'));
      positionContent = 'row';
      reversePosition = 'column';
      reverseSize = 'width';
    }
    return ([direction, margin, size, intervalPosition, positionContent, reversePosition, reverseSize]);
  }
}

// Шкала со значениями под ползунком
class ScaleOfValues {
  constructor(name) {
    this.name = name;
  }
  CreateScaleOfValues(parentElement, nameModel) {
    const position = new Scale().ScalePosition(parentElement, nameModel);
    $(parentElement).find(".scale").after($('<div class="scaleOfValues"></div>'));
    $(parentElement).find(".scaleOfValues").css(position[2], nameModel.sliderWidth + 16*1.35);
    $(parentElement).find(".scaleOfValues").css('flex-direction', position[5]);
    $(parentElement).find(".scaleOfValues").append($('<p></p>'));
    $(parentElement).find(".scaleOfValues").append($('<p></p>'));
    if (position[4] === 'row'){
      $(parentElement).find("p").css('margin', '0 1rem');
    }
    $(parentElement).find("p:first-child").text(nameModel.minRange);
    $(parentElement).find("p:last-child").text(nameModel.maxRange);
  }
}

//Значение над ручками
class ElementText {
  constructor(name) {
    this.name = name;
  }
  CreateElementText(parentElement, nameModel) {
    const elementFirst = $(parentElement).find(".thumb:first-child")[0];
    const elementSecond = $(parentElement).find(".thumb:last-child")[0];
    if(nameModel.oneThumb){
      elementFirst.dataset.element = nameModel.value;
    }
    else{
      elementFirst.dataset.element = nameModel.values[0];
      elementSecond.dataset.element = nameModel.values[1];
    }
  }
  СhangeValueElement(parentElement, nameModel, thumb){
    const position = new Scale().ScalePosition(parentElement, nameModel);
    const positionContainer = $(parentElement).find(".scale").offset()[position[0]];
    const thumbFirst = $(parentElement).find(".thumb:first-child").offset()[position[0]];
    const thumbSecond = $(parentElement).find(".thumb:last-child").offset()[position[0]];
    let value;
    const UnitRatio = nameModel.sliderWidth/(nameModel.maxRange-nameModel.minRange);
    if (nameModel.oneThumb){
      value = Math.trunc(((thumbFirst-positionContainer)/UnitRatio) + nameModel.minRange); 
      $(parentElement).find(".thumb:first-child")[0].dataset.element = value;
    }
    else {
      if (thumb === $(parentElement).find(".thumb:first-child")[0]) {
        value = Math.trunc(((thumbFirst-positionContainer)/UnitRatio) + nameModel.minRange); 
        $(parentElement).find(".thumb:first-child")[0].dataset.element = value;
      }
      else {
        value = Math.trunc(((thumbSecond-positionContainer)/UnitRatio) + nameModel.minRange); 
        $(parentElement).find(".thumb:last-child")[0].dataset.element = value;
      }
    }
    //Публикация
    $(document).trigger("onclick", [value, thumb, nameModel, parentElement]);
  }
}

// Ручки
class Thumb {
  constructor(name) {
    this.name = name;
  }
  CreateThumb(parentElement, nameModel) {
    $(parentElement).find(".scale").append($('<span class="thumb"></span>'));
    if (nameModel.positionHorizontal){
      $(parentElement).find(".thumb").css("bottom", ("-7px"));
    }
    else {
      $(parentElement).find(".thumb").css("left", ("-7px"));
    }
  }
  // Процесс перемещения ручек
  ThumbMovement(parentElement, nameModel) {
    $(parentElement).find(".thumb").mousedown(function (){
      $(document).mousemove($.proxy(function (){
        const thumb = this;
      //В зависимости от горизонтального или вертикального положения шкалы выбираем траекторию движения ручки
      let direction,
      cursorPosition;
      if (nameModel.positionHorizontal){
        direction = 'left';
        cursorPosition = Math.round(event.pageX-$(parentElement).find(".scale").offset()[direction]);
      }
      else {
        direction = 'top';
        cursorPosition = Math.round(event.pageY-$(parentElement).find(".scale").offset()[direction]);
      }
        //Задаем ограничения по движению ручек
      const positionContainer = $(parentElement).find(".scale").offset()[direction];
      let start,
      end;
        //Движение ручки по заданному шагу
        //количество шагов, вмещающихся в диапазон
        const recalculation = (nameModel.maxRange-nameModel.minRange) / nameModel.step;
        //количество пикселей в одном шаге
        let step = nameModel.sliderWidth / recalculation;
        //Ограничения для движения слайдера с одной ручкой
        if (nameModel.oneThumb){
          start = 0;
          end = nameModel.sliderWidth;
        }
        //Ограничения для движения слайдера с двумя ручками
        else if (this === $(parentElement).find(".thumb:first-child")[0]){
          start = 0;
          end = $(parentElement).find(".thumb:last-child").offset()[direction] - positionContainer - 21;
        }
        else{
          start = $(parentElement).find(".thumb:first-child").offset()[direction] - positionContainer + 19;
          end = nameModel.sliderWidth+1;
        }
        //Проверяем, чтобы ручки не выходили за заданные границы
        const coord = Number.parseInt(this.style[direction]);
        if (cursorPosition > coord + step){
          if (coord + step >= start  && coord + step <= end){
            // Двигаем ручки вперед
            this.style[direction] = coord + step + 'px';
            new Interval ('interval').WidthInterval(parentElement, nameModel);
            if (nameModel.elementText){
              new ElementText ('interval').СhangeValueElement(parentElement, nameModel, thumb);
            }
          }
        }
        else if(cursorPosition < coord - step){
          if (coord - step >= start  && coord - step <= end){
            // Двигаем ручки назад
            this.style[direction] = coord - step + 'px';
            new Interval ('interval').WidthInterval(parentElement, nameModel);
            if (nameModel.elementText){
              new ElementText ('interval').СhangeValueElement(parentElement, nameModel, thumb);
            }
          }
        }
      }, this) );
      $(document).mouseup(function (){
        $(document).off("mousemove");
      });
    });
  }
  //Позиция ручек по умолчанию
  DefaultPosition(parentElement, nameModel){
    const position = new Scale().ScalePosition(parentElement, nameModel);
    let recalculation;
    const UnitRatio = nameModel.sliderWidth/(nameModel.maxRange-nameModel.minRange);
    if(nameModel.oneThumb){
      recalculation = (nameModel.value-nameModel.minRange)*UnitRatio;
      $(parentElement).find(".thumb:first-child").css(position[0], (recalculation + 'px'));
    }
    else{
      recalculation = [];
      recalculation[0] = (nameModel.values[0]-nameModel.minRange)*UnitRatio;
      $(parentElement).find(".thumb:first-child").css(position[0], (recalculation[0] + 'px'));
      recalculation[1] = (nameModel.values[1]-nameModel.minRange)*UnitRatio;
      $(parentElement).find(".thumb:last-child").css(position[0], (recalculation[1] + 'px'));
    }
    return recalculation;
  }
}

//Создание закрашенного интервала между двумя ручками интервального ползунка
class Interval {
  constructor(name) {
    this.name = name;
  }
  CreateInterval(parentElement, nameModel) {
    $(parentElement).find(".thumb:first-child").after($('<div class="interval"></div>'));
    const position = new Scale().ScalePosition(parentElement, nameModel);
    const defaultPosition = new Thumb ('thumbOne').DefaultPosition(parentElement, nameModel);
    const width = defaultPosition[1] - defaultPosition[0];
    $(parentElement).find(".interval").css(position[2], (width + 'px'));
    $(parentElement).find(".interval").css(position[1], (defaultPosition[0] + 'px'));
  }
  WidthInterval(parentElement, nameModel){
    const position = new Scale().ScalePosition(parentElement, nameModel);
    const positionContainer = $(parentElement).find(".scale").offset()[position[0]];
    const thumbFirst = $(parentElement).find(".thumb:first-child").offset()[position[0]];
    const thumbSecond = $(parentElement).find(".thumb:last-child").offset()[position[0]];
    const width = thumbSecond - thumbFirst;
    $(parentElement).find(".interval").css(position[1], (thumbFirst - positionContainer + 'px'));
    $(parentElement).find(".interval").css(position[2], (width + 'px'));
  }
}

//Создание ползунка
class Slider {
  constructor(name) {
    this.name = name;
  }
  CreateSlider(nameScale, parentElement, nameModel) {
    new Container ('container').CreateContainer(parentElement, nameModel);
    new Scale (nameScale).CreateScale(parentElement, nameModel);
    new ScaleOfValues (nameScale).CreateScaleOfValues(parentElement, nameModel);
    if (nameModel.oneThumb){
      new Thumb ('thumbOne').CreateThumb(parentElement, nameModel);
    }
    else{
      new Thumb ('thumbOne').CreateThumb(parentElement, nameModel);
      new Thumb ('thumbTwo').CreateThumb(parentElement, nameModel);
      new Interval ('interval').CreateInterval(parentElement, nameModel);
    }
    if (nameModel.elementText){
      new ElementText ('element').CreateElementText(parentElement, nameModel);
    }
    new Thumb ('thumbOne').ThumbMovement(parentElement, nameModel);
    new Thumb ('thumbOne').DefaultPosition(parentElement, nameModel);
  }
}

//Создание панели управления
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
      $(parentElement).find(".containerRow:nth-child(5) label").text('Thumb value');
      $(parentElement).find(".containerRow:nth-child(5)").append($(`<input id="value-${parentId}" type=number value=${nameModel.value} min=0></input>`));

      $(parentElement).append($('<div class="containerRow"></div>'));
      $(parentElement).find(".containerRow:nth-child(6)").append($(`<label for="values1-${parentId}"></label>`));
      $(parentElement).find(".containerRow:nth-child(6) label").text('Thumbs values');
      $(parentElement).find(".containerRow:nth-child(6)").append($(`<input id="values1-${parentId}" type=number value=${nameModel.values[0]} min=0></input>`));
      $(parentElement).find(".containerRow:nth-child(6)").append($(`<input id="values2-${parentId}"type=number value=${nameModel.values[1]} min=0></input>`));

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

      //Публикация
      $("input").trigger("change", [nameModel, parentElement]);
  }
}

new Slider ('SliderOne').CreateSlider('horizontalScale', ".container1", inputsValue);
new ControlPanel ('panel1').CreateControlPanel(".containerPanel1", inputsValue);

new Slider ('Slidertwo').CreateSlider('jScale', ".container2", i);

new Slider ('Slidervv').CreateSlider('jSxccc', ".container3", inputsValue);