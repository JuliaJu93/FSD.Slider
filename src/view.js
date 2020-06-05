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
    const elementFirst = $(parentElement).find(".thumb:first-child")[0];
    const elementSecond = $(parentElement).find(".thumb:last-child")[0];
    const positionContainer = $(parentElement).find(".scale").offset()[position[0]];
    const elementFirstPosition = ($(parentElement).find(".thumb:first-child").offset()[position[0]]) - positionContainer;
    const elementSecondPosition = ($(parentElement).find(".thumb:last-child").offset()[position[0]]) - positionContainer;
    const UnitRatio = nameModel.sliderWidth/(nameModel.maxRange-nameModel.minRange);
    let value;
    if(nameModel.oneThumb){
      value = Math.round(elementFirstPosition/UnitRatio+nameModel.minRange);
      elementFirst.dataset.element = value;
    }
    else{
      if (thumb === elementFirst){
      value = Math.round(elementFirstPosition/UnitRatio+nameModel.minRange);
      elementFirst.dataset.element = value;
      }
      else{
        value = Math.round(elementSecondPosition/UnitRatio+nameModel.minRange);
        elementSecond.dataset.element = value;
      }
    }
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
      //В зависимости от горизонтального или вертикального положения шкалы выбираем траекторию движения ручки
       let thumbDisplacement = 0;
       let direction = 0;
       const recalculation = Math.round((nameModel.maxRange - nameModel.minRange)/nameModel.sliderWidth);
       const step = nameModel.step/recalculation;
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
        let start,
        end;
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
          end = nameModel.sliderWidth;
        }
        //Проверяем, чтобы ручки не выходили за заданные границы
        const coord = Number.parseInt(this.style[direction]);
        if (coord + thumbDisplacement >= start-1  && coord + thumbDisplacement < end){
        // Двигаем ручки
          this.style[direction] = coord + thumbDisplacement + 'px';
          const thumb = this;
          new Interval ('interval').WidthInterval(parentElement, nameModel);
          if (nameModel.elementText){
            new ElementText ('interval').СhangeValueElement(parentElement, nameModel, thumb);
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
    console.log(recalculation, UnitRatio);
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

new Slider ('SliderOne').CreateSlider('horizontalScale', ".container1", inputsValue);
new Slider ('Slidertwo').CreateSlider('jScale', ".container2", i);
new Slider ('Slidervv').CreateSlider('jSxccc', ".container3", inputsValue);



