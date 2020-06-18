import $ from 'jquery'
import  {Model} from './model.js'

class Container {
  constructor(name, scale, parentElement, nameModel) {
    this.name = name;
    this.parentElement = parentElement;
    this.nameModel = nameModel;
    this.scale = scale;
  }
  createContainer() {
    $(this.parentElement).append($('<div class="containerOfSlider"></div>'));
    const position = this.scale.scalePosition();
    $(this.parentElement).find(".containerOfSlider").css('flex-direction', position[4]);
  }
}

//Создание Шкалы произвольной ширины, с возможностью изменять ее позицию (горизонтальная или вертикальная)
class Scale {
  constructor(name, parentElement, nameModel) {
    this.name = name;
    this.parentElement = parentElement;
    this.nameModel = nameModel;
  }
  createScale() {
    $(this.parentElement).find(".containerOfSlider").append($('<div class="scale"></div>'));
    const position = this.scalePosition();
    $(this.parentElement).find(".scale").css(position[2], this.nameModel.sliderWidth + 16);
  }
   //Пересчет значений в модели на пиксели;
  countToPixels(){
    const position = this.scalePosition();
    let recalculation;
    const UnitRatio = this.nameModel.sliderWidth/(this.nameModel.maxRange-this.nameModel.minRange);
    if(this.nameModel.oneThumb){
      recalculation = (this.nameModel.value-this.nameModel.minRange)*UnitRatio;
    }
    else {
      recalculation = [];
      recalculation[0] = (this.nameModel.values[0]-this.nameModel.minRange)*UnitRatio;
      recalculation[1] = (this.nameModel.values[1]-this.nameModel.minRange)*UnitRatio;
    }
    return recalculation;
  }
  // Параметры, которые зависят от положения шкалы
  scalePosition() {
    let direction,
      margin,
      size,
      intervalPosition,
      positionContent,
      reversePosition,
      reverseSize;
    if (this.nameModel.positionHorizontal){
      direction = 'left';
      margin = 'margin-left';
      size = 'width';
      intervalPosition = $(this.parentElement).find(".interval").css('height', (100 + '%'));
      positionContent = 'column';
      reversePosition = 'row';
      reverseSize = 'height';
    }
    else {
      direction = 'top';
      margin = 'margin-top';
      size = 'height';
      intervalPosition = $(this.parentElement).find(".interval").css('width', (100 + '%'));
      positionContent = 'row';
      reversePosition = 'column';
      reverseSize = 'width';
    }
    return ([direction, margin, size, intervalPosition, positionContent, reversePosition, reverseSize]);
  }
}

// Шкала со значениями под ползунком
class ScaleOfValues {
  constructor(name, scale, parentElement, nameModel) {
    this.name = name;
    this.parentElement = parentElement;
    this.nameModel = nameModel;
    this.scale = scale;
  }
  createScaleOfValues() {
    const position = this.scale.scalePosition();
    $(this.parentElement).find(".scale").after($('<div class="scaleOfValues"></div>'));
    $(this.parentElement).find(".scaleOfValues").css(position[2], this.nameModel.sliderWidth + 16*1.35);
    $(this.parentElement).find(".scaleOfValues").css('flex-direction', position[5]);
    $(this.parentElement).find(".scaleOfValues").append($('<p></p>'));
    $(this.parentElement).find(".scaleOfValues").append($('<p></p>'));
    if (position[4] === 'row'){
      $(this.parentElement).find("p").css('margin', '0 1rem');
    }
    $(this.parentElement).find("p:first-child").text(this.nameModel.minRange);
    $(this.parentElement).find("p:last-child").text(this.nameModel.maxRange);
  }
}

//Значение над ручками
class ElementText {
  constructor(name, scale, parentElement, nameModel) {
    this.name = name;
    this.parentElement = parentElement;
    this.nameModel = nameModel;
    this.scale = scale;
  }
  createElementText() {
    const elementFirst = $(this.parentElement).find(".thumb:first-child")[0];
    const elementSecond = $(this.parentElement).find(".thumb:last-child")[0];
    if(this.nameModel.oneThumb){
      elementFirst.dataset.element = this.nameModel.value;
    }
    else{
      elementFirst.dataset.element = this.nameModel.values[0];
      elementSecond.dataset.element = this.nameModel.values[1];
    }
  }
  changeValueElement(thumb){
    const position = this.scale.scalePosition();
    const positionContainer = $(this.parentElement).find(".scale").offset()[position[0]];
    const thumbFirst = $(this.parentElement).find(".thumb:first-child").offset()[position[0]];
    const thumbSecond = $(this.parentElement).find(".thumb:last-child").offset()[position[0]];
    let value;
    const UnitRatio = this.nameModel.sliderWidth/(this.nameModel.maxRange-this.nameModel.minRange);
    if (this.nameModel.oneThumb){
      value = Math.trunc(((thumbFirst-positionContainer)/UnitRatio) + this.nameModel.minRange); 
      $(this.parentElement).find(".thumb:first-child")[0].dataset.element = value;
    }
    else {
      if (thumb === $(this.parentElement).find(".thumb:first-child")[0]) {
        value = Math.trunc(((thumbFirst-positionContainer)/UnitRatio) + this.nameModel.minRange); 
        $(this.parentElement).find(".thumb:first-child")[0].dataset.element = value;
      }
      else {
        value = Math.trunc(((thumbSecond-positionContainer)/UnitRatio) + this.nameModel.minRange); 
        $(this.parentElement).find(".thumb:last-child")[0].dataset.element = value;
      }
    }
    //Публикация
    $(document).trigger("onclick", [value, thumb, this.nameModel, this.parentElement]);
  }
}

// Ручки
class Thumb {
  constructor(name, scale, interval, elementText, parentElement, nameModel) {
    this.name = name;
    this.parentElement = parentElement;
    this.nameModel = nameModel;
    this.scale = scale;
    this.interval = interval;
    this.elementText = elementText;
  }
  createThumb() {
    $(this.parentElement).find(".scale").append($('<span class="thumb"></span>'));
    if (this.nameModel.positionHorizontal){
      $(this.parentElement).find(".thumb").css("bottom", ("-7px"));
    }
    else {
      $(this.parentElement).find(".thumb").css("left", ("-7px"));
    }
  }
  // Процесс перемещения ручек
  thumbMovement() {
    $(this.parentElement).find(".thumb").mousedown(() => {
      const thumb = event.currentTarget;
      $(document).mousemove(() => {
      //В зависимости от горизонтального или вертикального положения шкалы выбираем траекторию движения ручки
      let direction,
      cursorPosition;
      if (this.nameModel.positionHorizontal){
        direction = 'left';
        cursorPosition = Math.round(event.pageX-$(this.parentElement).find(".scale").offset()[direction]);
      }
      else {
        direction = 'top';
        cursorPosition = Math.round(event.pageY-$(this.parentElement).find(".scale").offset()[direction]);
      }
      //Задаем ограничения по движению ручек
      const positionContainer = $(this.parentElement).find(".scale").offset()[direction];
      let start,
      end;
        //Движение ручки по заданному шагу
        //количество шагов, вмещающихся в диапазон
        const recalculation = (this.nameModel.maxRange-this.nameModel.minRange) / this.nameModel.step;
        //количество пикселей в одном шаге
        let step = this.nameModel.sliderWidth / recalculation;
        //Ограничения для движения слайдера с одной ручкой
        if (this.nameModel.oneThumb){
          start = 0;
          end = this.nameModel.sliderWidth;
        }
        //Ограничения для движения слайдера с двумя ручками
        else if (thumb === $(this.parentElement).find(".thumb:first-child")[0]){
          start = 0;
          end = $(this.parentElement).find(".thumb:last-child").offset()[direction] - positionContainer - 21;
        }
        else{
          start = $(this.parentElement).find(".thumb:first-child").offset()[direction] - positionContainer + 19;
          end = this.nameModel.sliderWidth+1;
        }
        //Проверяем, чтобы ручки не выходили за заданные границы
        const coord = Number.parseInt(thumb.style[direction]);
        if (cursorPosition > coord + step){
          if (coord + step >= start  && coord + step <= end){
            // Двигаем ручки вперед
            thumb.style[direction] = coord + step + 'px';
          }
        }
        else if(cursorPosition < coord - step){
          if (coord - step >= start  && coord - step <= end){
            // Двигаем ручки назад
            thumb.style[direction] = coord - step + 'px';
          }
        }
        if (this.nameModel.elementText){
          this.elementText.changeValueElement(thumb);
        }
        this.interval.widthInterval();
      });
      $(document).mouseup(function (){
        $(document).off("mousemove");
      });
    });
  }
  //Позиция ручек по умолчанию
  defaultPosition(){
    const recalculation = this.scale.countToPixels();
    const position = this.scale.scalePosition();
    if(this.nameModel.oneThumb){
      $(this.parentElement).find(".thumb:first-child").css(position[0], (recalculation + 'px'));
    }
    else{
      $(this.parentElement).find(".thumb:first-child").css(position[0], (recalculation[0] + 'px'));
      $(this.parentElement).find(".thumb:last-child").css(position[0], (recalculation[1] + 'px'));
    }
  }
}

//Создание закрашенного интервала между двумя ручками интервального ползунка
class Interval {
  constructor(name, scale, parentElement, nameModel) {
    this.name = name;
    this.scale = scale;
    this.parentElement = parentElement;
    this.nameModel = nameModel;
  }
  createInterval() {
    $(this.parentElement).find(".thumb:first-child").after($('<div class="interval"></div>'));
    const position = this.scale.scalePosition();
    const defaultPosition = this.scale.countToPixels();
    const width = defaultPosition[1] - defaultPosition[0];
    $(this.parentElement).find(".interval").css(position[2], (width + 'px'));
    $(this.parentElement).find(".interval").css(position[1], (defaultPosition[0] + 'px'));
  }
  widthInterval(){
    const position = this.scale.scalePosition();
    const positionContainer = $(this.parentElement).find(".scale").offset()[position[0]];
    const thumbFirst = $(this.parentElement).find(".thumb:first-child").offset()[position[0]];
    const thumbSecond = $(this.parentElement).find(".thumb:last-child").offset()[position[0]];
    const width = thumbSecond - thumbFirst;
    $(this.parentElement).find(".interval").css(position[1], (thumbFirst - positionContainer + 'px'));
    $(this.parentElement).find(".interval").css(position[2], (width + 'px'));
  }
}

//Создание ползунка
class Slider {
  constructor(name, nameScale, parentElement, nameModel) {
    this.name = name;
    this.parentElement = parentElement;
    this.nameModel = nameModel;
    this.scale = new Scale (nameScale, parentElement, nameModel);
    this.container = new Container ('container', this.scale, parentElement, nameModel);
    this.interval = new Interval ('interval', this.scale, parentElement, nameModel);
    this.elementText = new ElementText ('element', this.scale, parentElement, nameModel);
    this.scaleOfValues = new ScaleOfValues (nameScale, this.scale, parentElement, nameModel);
    this.singleThumb = new Thumb ('thumbOne', this.scale, this.interval, this.elementText, parentElement, nameModel);
    this.doubleThumb1 = new Thumb ('thumbOne', this.scale, this.interval, this.elementText, parentElement, nameModel);
    this.doubleThumb2 = new Thumb ('thumbTwo', this.scale, this.interval, this.elementText, parentElement, nameModel);
  }
  createSlider() {
    this.container.createContainer();
    this.scale.createScale();
    this.scaleOfValues.createScaleOfValues();
    if (this.nameModel.oneThumb){
      this.singleThumb.createThumb();
    }
    else {
      this.doubleThumb1.createThumb();
      this.doubleThumb2.createThumb();
      this.interval.createInterval();
    }
    if (this.nameModel.elementText){
      this.elementText.createElementText();
    }
    this.doubleThumb1.thumbMovement();
    this.doubleThumb1.defaultPosition();
  }
}

//Создание панели управления
class ControlPanel {
  constructor(name, parentElement, nameModel) {
    this.name = name;
    this.parentElement = parentElement;
    this.nameModel = nameModel;
  }
  createControlPanel() {
    const parentId =  $(this.parentElement).attr('id');

    $(this.parentElement).append($('<div class="containerRow"></div>'));
    $(this.parentElement).find(".containerRow:first-child").append($(`<label for='position-${parentId}'></label>`));
    $(this.parentElement).find(".containerRow:first-child label").text('Position horizontal');
    let position; 
    if (this.nameModel.positionHorizontal){
      position = 'checked';
    }
    $(this.parentElement).find(".containerRow:first-child ").append($(`<input type=checkbox id='position-${parentId}' ${position}></input>`));

    $(this.parentElement).append($('<div class="containerRow"></div>'));
    $(this.parentElement).find(".containerRow:nth-child(2)").append($(`<label for="min-${parentId}"></label>`));
    $(this.parentElement).find(".containerRow:nth-child(2) label").text('Minimum value');
    $(this.parentElement).find(".containerRow:nth-child(2)").append($(`<input id="min-${parentId}" type=number value=${this.nameModel.minRange} min=0></input>`));

    $(this.parentElement).append($('<div class="containerRow"></div>'));
    $(this.parentElement).find(".containerRow:nth-child(3)").append($(`<label for="max-${parentId}"></label>`));
    $(this.parentElement).find(".containerRow:nth-child(3) label").text('Maximum value');
    $(this.parentElement).find(".containerRow:nth-child(3)").append($(`<input id="max-${parentId}" type=number value=${this.nameModel.maxRange} min=0></input>`));

    $(this.parentElement).append($('<div class="containerRow"></div>'));
    $(this.parentElement).find(".containerRow:nth-child(4)").append($(`<label for="thumb-${parentId}"></label>`));
    $(this.parentElement).find(".containerRow:nth-child(4) label").text('One thumb');
    let thumb; 
    if (this.nameModel.oneThumb){
      thumb = 'checked';
    }
    $(this.parentElement).find(".containerRow:nth-child(4)").append($(`<input id="thumb-${parentId}" type=checkbox ${thumb}></input>`));

    $(this.parentElement).append($('<div class="containerRow"></div>'));
    $(this.parentElement).find(".containerRow:nth-child(5)").append($(`<label for="value-${parentId}"></label>`));
    $(this.parentElement).find(".containerRow:nth-child(5) label").text('Thumb value');
    $(this.parentElement).find(".containerRow:nth-child(5)").append($(`<input id="value-${parentId}" type=number value=${this.nameModel.value} min=0></input>`));

    $(this.parentElement).append($('<div class="containerRow"></div>'));
    $(this.parentElement).find(".containerRow:nth-child(6)").append($(`<label for="values1-${parentId}"></label>`));
    $(this.parentElement).find(".containerRow:nth-child(6) label").text('Thumbs values');
    $(this.parentElement).find(".containerRow:nth-child(6)").append($(`<input id="values1-${parentId}" type=number value=${this.nameModel.values[0]} min=0></input>`));
    $(this.parentElement).find(".containerRow:nth-child(6)").append($(`<input id="values2-${parentId}"type=number value=${this.nameModel.values[1]} min=0></input>`));

    $(this.parentElement).append($('<div class="containerRow"></div>'));
    $(this.parentElement).find(".containerRow:nth-child(7)").append($(`<label for="step-${parentId}"></label>`));
    $(this.parentElement).find(".containerRow:nth-child(7) label").text('Step');
    $(this.parentElement).find(".containerRow:nth-child(7)").append($(`<input id="step-${parentId}" type=number value=${this.nameModel.step} min=0></input>`));

    $(this.parentElement).append($('<div class="containerRow"></div>'));
    $(this.parentElement).find(".containerRow:nth-child(8)").append($(`<label for="text-${parentId}"></label>`));
    $(this.parentElement).find(".containerRow:nth-child(8) label").text('Value above the thumb');
    let element; 
    if (this.nameModel.elementText){
      element = 'checked';
    }
    $(this.parentElement).find(".containerRow:nth-child(8)").append($(`<input id="text-${parentId}" type=checkbox ${element}></input>`));
    
    //Публикация
     $("input").trigger("change", [this.nameModel, this.parentElement]);
  }
}

let model1 = new Model ('model1', 400, true, 0, 200, false, [50, 180], 180, 10, true);
new Slider ('SliderOne', 'Scale1', ".container1", model1).createSlider();
new ControlPanel ('panel1', ".containerPanel1", model1).createControlPanel();

let model2 = new Model ('model2', 200, false, 20, 100, true, [20, 90], 50, 1, true);
new Slider ('Slidertwo', 'Scale2', ".container2", model2).createSlider();
new ControlPanel ('panel2', ".containerPanel2", model2).createControlPanel();

let model3 = new Model ('model2', 400,  true, 10, 100, false, [20, 90], 50, 40, false);
new Slider ('Slidervv', 'Scale3', ".container3", model3).createSlider();
new ControlPanel ('panel3', ".containerPanel3", model3).createControlPanel();