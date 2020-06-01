import $ from 'jquery'
import  {inputsValue, i} from './model.js'

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
  CreateContainerElementText(parentElement, nameModel) {
    const position = new Scale().ScalePosition(parentElement, nameModel);
    $(parentElement).find(".containerOfSlider").prepend($('<div class="containerElementText"></div>'));
    $(parentElement).find(".containerElementText").css(position[2], (nameModel.sliderWidth + 16*1.35 + 'px'));
    $(parentElement).find(".containerElementText").css(position[6], (40 + 'px'));
  }
  CreateElementText(parentElement, nameModel) {
    if (nameModel.oneThumb){
    $(parentElement).find(".containerElementText").append($('<p class="elementText"></p>'));
    $(parentElement).find(".containerElementText p").text(nameModel.value);
    }
    else{
      $(parentElement).find(".containerElementText").append($('<p class="elementText"></p>'));
      $(parentElement).find(".containerElementText").append($('<p class="elementText"></p>'));
      $(parentElement).find(".containerElementText p:first-child").text(nameModel.values[0]);
      $(parentElement).find(".containerElementText p:last-child").text(nameModel.values[1]);
    }
    new ElementText ('element').СhangePositionElement(parentElement, nameModel);
  }
  СhangePositionElement(parentElement, nameModel){
    const position = new Scale().ScalePosition(parentElement, nameModel);
    const positionContainer = $(parentElement).find(".scale").offset()[position[0]];
    let elementFirst = $(parentElement).find(".thumb:first-child").offset()[position[0]];
    let elementSecond = $(parentElement).find(".thumb:last-child").offset()[position[0]];
    $(parentElement).find(".elementText:first-child").css(position[0], (elementFirst - positionContainer - 16 + 'px'));
    $(parentElement).find(".elementText:last-child").css(position[0], (elementSecond - positionContainer + 16 + 'px'));
  }
  СhangeValueElement(parentElement, nameModel, thumb){
    const position = new Scale().ScalePosition(parentElement, nameModel);
    const positionContainer = $(parentElement).find(".scale").offset()[position[0]];
    const elementFirst = ($(parentElement).find(".thumb:first-child").offset()[position[0]]) - positionContainer;
    const elementSecond = ($(parentElement).find(".thumb:last-child").offset()[position[0]]) - positionContainer;
    let value;
    if (thumb === $(parentElement).find(".thumb:first-child")[0]){
      value = Math.round((nameModel.maxRange - nameModel.minRange) * elementFirst/nameModel.sliderWidth);
      $(parentElement).find(".containerElementText p:first-child").text(value);
    }
    else{
      value = Math.round((nameModel.maxRange - nameModel.minRange) * elementSecond /nameModel.sliderWidth);
      $(parentElement).find(".containerElementText p:last-child").text(value);
    }
  }
}

// Ручки
class Thumb {
  constructor(name) {
  }
  CreateThumb(parentElement, nameModel) {
    $(parentElement).find(".scale").append($('<span class="thumb" ></span>'));
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
      //В зависимости от горизонтального или вертикального положения шкалы выбираем траекторию движения ручки
       let thumbDisplacement = 0;
       let direction = 0;
       if (nameModel.positionHorizontal){
         thumbDisplacement = event.movementX;
         direction = 'left';
       }
       else {
         thumbDisplacement = event.movementY;
         direction = 'top';
       }
        //Задаем ограничения по движению ручек
        const positionContainer = $(parentElement).find(".scale").offset()[direction];
        let start = 0;
        let end = 0;
        //Ограничения для движения слайдера с одной ручкой
        if (nameModel.oneThumb){
          start = 0;
          end = nameModel.sliderWidth;
        }
        //Ограничения для движения слайдера с двумя ручками
        else if (this === $(parentElement).find(".thumb:first-child")[0]){
          start = 0;
          end = $(parentElement).find(".thumb:last-child").offset()[direction] - positionContainer - 16*1.35;
        }
        else{
          start = $(parentElement).find(".thumb:first-child").offset()[direction] - positionContainer + 16*1.25;
          end = inputsValue.sliderWidth;
        }
        //Проверяем, чтобы ручки не выходили за заданные границы
        const coord = Number.parseInt(this.style[direction]);
        if (coord + thumbDisplacement >= start-1  && coord + thumbDisplacement < end){
        // Двигаем ручки
          this.style[direction] = coord + thumbDisplacement + 'px';
          const thumb = this;
          new Interval ('interval').WidthInterval(parentElement, nameModel);
          new ElementText ('element').СhangePositionElement(parentElement, nameModel);
          new ElementText ('element').СhangeValueElement(parentElement, nameModel, thumb);
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
    if (nameModel.oneThumb){
      //Пересчитываем заданное в модели значение на пиксели
      recalculation = (nameModel.sliderWidth * nameModel.value)/(nameModel.maxRange - nameModel.minRange);
      $(parentElement).find(".thumb").css(position[0], (recalculation + 'px'));
    }
    else{
      recalculation = [];
      recalculation[0] = Math.round((nameModel.sliderWidth * nameModel.values[0])/(nameModel.maxRange - nameModel.minRange));
      $(parentElement).find(".thumb:first-child").css(position[0], (recalculation[0] + 'px'));
      recalculation[1] = Math.round((nameModel.sliderWidth * nameModel.values[1])/(nameModel.maxRange - nameModel.minRange));
      $(parentElement).find(".thumb:last-child").css(position[0], (recalculation[1] + 'px'));
      return recalculation;
    }
  }
}

//Создание закрашенного интервала между двумя ручками интервального ползунка
class Interval {
  constructor(name) {
    this.name = name;
  }
  CreateInterval(parentElement, nameModel) {
    $(parentElement).find(".thumb:first-child").after($('<div class="interval"></div>'))
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
      if(nameModel.elementText){
        new ElementText ('containerElement').CreateContainerElementText(parentElement, nameModel);
        new ElementText ('element').CreateElementText(parentElement, nameModel);
      }
    }
    else{
      new Thumb ('thumbOne').CreateThumb(parentElement, nameModel);
      new Thumb ('thumbTwo').CreateThumb(parentElement, nameModel);
      new Interval ('interval').CreateInterval(parentElement, nameModel);
      if(nameModel.elementText){
        new ElementText ('containerElement').CreateContainerElementText(parentElement, nameModel);
        new ElementText ('element').CreateElementText(parentElement, nameModel);
      }
    }
    new Thumb ('thumbOne').ThumbMovement(parentElement, nameModel);
    new Thumb ('thumbOne').DefaultPosition(parentElement, nameModel);
  }
}

new Slider ('SliderOne').CreateSlider('horizontalScale', ".containerSlider", inputsValue);
new Slider ('Slidertwo').CreateSlider('jScale', ".containerSlider2", i);
new Slider ('Slidervv').CreateSlider('jSxccc', ".containerSlider3", inputsValue);



