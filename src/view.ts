let $ = require ('jquery');

export class Container {
  name:string;
  parentElement:string;
  scale:Scale;
  constructor(_name, _scale, _parentElement) {
    this.name = _name;
    this.parentElement = _parentElement;
    this.scale = _scale;
  }
  createContainer(model) {
    $(this.parentElement).append($('<div class="containerOfSlider"></div>'));
    const position = this.scale.scalePosition(model);
    $(this.parentElement).find(".containerOfSlider").css('flex-direction', position.positionContent);
  }
  deleteContainer() {
    $(this.parentElement).find(".containerOfSlider").remove();
  }
}

//Создание Шкалы произвольной ширины, с возможностью изменять ее позицию (горизонтальная или вертикальная)
export class Scale {
  name:string;
  parentElement:string;
  constructor(_name, _parentElement) {
    this.name = _name;
    this.parentElement = _parentElement;
  }
  createScale(model) {
    $(this.parentElement).find(".containerOfSlider").append($('<div class="scale"></div>'));
    const position = this.scalePosition(model);
    $(this.parentElement).find(".scale").css(position.size, model.sliderWidth + 16);
  }
  //Пересчет значений в модели на пиксели;
  countToPixels(model){
    let recalculation:Array<number> = [];
    const UnitRatio:number = model.sliderWidth/(model.maxRange-model.minRange);
    if(model.oneThumb){
      recalculation[0] = (model.value-model.minRange)*UnitRatio;
    }
    else {
      recalculation[0] = (model.values[0]-model.minRange)*UnitRatio;
      recalculation[1] = (model.values[1]-model.minRange)*UnitRatio;
    }
    return recalculation;
  }
  // Параметры, которые зависят от положения шкалы
  scalePosition(model) {
    let direction:string,
      margin:string,
      size:string,
      intervalPosition:string,
      positionContent:string,
      reversePosition:string;
    if (model.positionHorizontal){
      direction = 'left';
      margin = 'margin-left';
      size = 'width';
      intervalPosition = $(this.parentElement).find(".interval").css('height', (100 + '%'));
      positionContent = 'column';
      reversePosition = 'row';
    }
    else {
      direction = 'top';
      margin = 'margin-top';
      size = 'height';
      intervalPosition = $(this.parentElement).find(".interval").css('width', (100 + '%'));
      positionContent = 'row';
      reversePosition = 'column';
    }
    return ({direction, margin, size, positionContent, reversePosition});
  }
  deleteScale() {
    $(this.parentElement).find(".scale").remove();
  }
}

// Шкала со значениями под ползунком
export class ScaleOfValues {
  name: string;
  parentElement: string;
  scale: Scale;
  constructor(_name, _scale, _parentElement) {
    this.name = _name;
    this.parentElement = _parentElement;
    this.scale = _scale;
  }
  createScaleOfValues(model) {
    const position = this.scale.scalePosition(model);
    $(this.parentElement).find(".scale").after($('<div class="scaleOfValues"></div>'));
    $(this.parentElement).find(".scaleOfValues").css(position.size, model.sliderWidth + 16*1.35);
    $(this.parentElement).find(".scaleOfValues").css('flex-direction', position.reversePosition);
    $(this.parentElement).find(".scaleOfValues").append($('<p></p>'));
    $(this.parentElement).find(".scaleOfValues").append($('<p></p>'));
    if (position.positionContent === 'row'){
      $(this.parentElement).find("p").css('margin', '0 1rem');
    }
    $(this.parentElement).find("p:first-child").text(model.minRange);
    $(this.parentElement).find("p:last-child").text(model.maxRange);
  }
  deleteScaleOfValues() {
    $(this.parentElement).find(".scaleOfValues").remove();
  }
}

//Значение над ручками
export class ElementText {
  name: string;
  parentElement: string;
  scale: Scale;
  constructor(_name, _scale, _parentElement) {
    this.name = _name;
    this.parentElement = _parentElement;
    this.scale = _scale;
  }
  createElementText(model) {
    const elementFirst = $(this.parentElement).find(".thumb:first-child")[0];
    const elementSecond = $(this.parentElement).find(".thumb:last-child")[0];
    if (model.elementText) {
      if (model.oneThumb) {
        elementFirst.dataset.element = model.value;
      }
      else {
        elementFirst.dataset.element = model.values[0];
        elementSecond.dataset.element = model.values[1];
      }
    }
    else {
      if (model.oneThumb){
        elementFirst.dataset.element = '';
      }
      else {
        elementFirst.dataset.element = '';
        elementSecond.dataset.element = '';
      }
    }
  }
  changeValueElement(thumb, direction, model){
    let value:number;
    if (model.elementText && direction !== false) { 
      if (model.oneThumb){
        value = +($(this.parentElement).find(".thumb:first-child")[0].dataset.element) + +model.step*direction;
        $(this.parentElement).find(".thumb:first-child")[0].dataset.element = value;
      }
      else {
        if (thumb === $(this.parentElement).find(".thumb:first-child")[0]) {
          if (model.elementText) {  
            value = +($(this.parentElement).find(".thumb:first-child")[0].dataset.element) + +model.step*direction;
            $(this.parentElement).find(".thumb:first-child")[0].dataset.element = value;
          }
        }
        else {
          if (model.elementText) { 
            value = +($(this.parentElement).find(".thumb:last-child")[0].dataset.element) + +model.step*direction;
            $(this.parentElement).find(".thumb:last-child")[0].dataset.element = value;
          }
        }
      }
    }
    else {
      if (model.oneThumb){
        value = model.value + +model.step*direction;
        if (direction === false && model.elementText) {
          $(this.parentElement).find(".thumb:first-child")[0].dataset.element = model.value;
        }
      }
      else {
        if (thumb === $(this.parentElement).find(".thumb:first-child")[0]) {
          value = model.values[0] + +model.step*direction;
          if (direction === false && model.elementText) {
            $(this.parentElement).find(".thumb:first-child")[0].dataset.element = model.values[0];
          }
        }
        else {
          value = model.values[1] + +model.step*direction;
          if (direction === false && model.elementText) {
            $(this.parentElement).find(".thumb:last-child")[0].dataset.element = model.values[1];
          }
        }
      }
    }
    //Публикация
    $(document).trigger("onclick", [value, thumb, model, this.parentElement]);
  }
}

// Ручки
export class Thumb {
  name: string;
  parentElement: string;
  scale: Scale;
  interval: Interval;
  elementText: ElementText;
  constructor(_name, _scale, _interval, _elementText, _parentElement) {
    this.name = _name;
    this.parentElement = _parentElement;
    this.scale = _scale;
    this.interval = _interval;
    this.elementText = _elementText;
  }
  createThumb(model) {
    $(this.parentElement).find(".scale").append($('<span class="thumb"></span>'));
    if (model.positionHorizontal) {
      $(this.parentElement).find(".thumb").css("bottom", ("-7px"));
    }
    else {
      $(this.parentElement).find(".thumb").css("left", ("-7px"));
    }
  }
  // Процесс перемещения ручек
  thumbMovement(model) {
    $(this.parentElement).find(".thumb").mousedown(() => {
      const thumb = event.currentTarget;
      $(document).mousemove((event: MouseEvent) => {
      //В зависимости от горизонтального или вертикального положения шкалы выбираем траекторию движения ручки
      let direction:string,
      cursorPosition:number;
      if (model.positionHorizontal){
        direction = 'left';
        cursorPosition = Math.round(event.pageX-$(this.parentElement).find(".scale").offset()[direction]);
      }
      else {
        direction = 'top';
        cursorPosition = Math.round(event.pageY-$(this.parentElement).find(".scale").offset()[direction]);
      }
      //Задаем ограничения по движению ручек
      const positionContainer:number = $(this.parentElement).find(".scale").offset()[direction];
      let start: number,
      end: number;
        //Движение ручки по заданному шагу
        //количество шагов, вмещающихся в диапазон
        const recalculation = (model.maxRange-model.minRange) / model.step;
        //количество пикселей в одном шаге
        let step:number = Math.trunc(model.sliderWidth / recalculation);
        //Ограничения для движения слайдера с одной ручкой
        if (model.oneThumb){
          start = 0;
          end = model.sliderWidth;
        }
        //Ограничения для движения слайдера с двумя ручками
        else if (thumb === $(this.parentElement).find(".thumb:first-child")[0]){
          start = 0;
          end = $(this.parentElement).find(".thumb:last-child").offset()[direction] - positionContainer - 21;
        }
        else {
          start = $(this.parentElement).find(".thumb:first-child").offset()[direction] - positionContainer + 19;
          end = model.sliderWidth+1;
        }
        //Проверяем, чтобы ручки не выходили за заданные границы
        const coord:number = Number.parseInt((thumb as HTMLElement).style[direction]);
        if (cursorPosition > coord + step){
          if (coord + step >= start  && coord + step <= end) {
            // Двигаем ручки вперед
            (thumb as HTMLElement).style[direction] = coord + step + 'px';
            this.elementText.changeValueElement(thumb, 1, model);
          }
        }
        else if(cursorPosition < coord - step){
          if (coord - step >= start  && coord - step <= end) {
            // Двигаем ручки назад
            (thumb as HTMLElement).style[direction] = coord - step + 'px';
            this.elementText.changeValueElement(thumb, -1, model);
          }
        }
        this.interval.widthInterval(model);
      });
      $(document).mouseup(function (){
        $(document).off("mousemove");
      });
    });
  }
  //Позиция ручек по умолчанию
  defaultPosition(model) {
    const recalculation:Array<number> = this.scale.countToPixels(model);
    const position = this.scale.scalePosition(model);
    if (model.oneThumb) {
      $(this.parentElement).find(".thumb:first-child").css(position.direction, (recalculation + 'px'));
    }
    else {
      $(this.parentElement).find(".thumb:first-child").css(position.direction, (recalculation[0] + 'px'));
      $(this.parentElement).find(".thumb:last-child").css(position.direction, (recalculation[1] + 'px'));
    }
    this.interval.widthInterval(model);
  }
  deleteThumb() {
    $(this.parentElement).find(".thumb").remove();
  }
}

//Создание закрашенного интервала между двумя ручками интервального ползунка
export class Interval {
  name: string;
  parentElement: string;
  scale: Scale;
  constructor(_name, _scale, _parentElement) {
    this.name = _name;
    this.scale = _scale;
    this.parentElement = _parentElement;
  }
  createInterval(model) {
    $(this.parentElement).find(".thumb:first-child").after($('<div class="interval"></div>'));
    const position = this.scale.scalePosition(model);
    const defaultPosition:Array<number> = this.scale.countToPixels(model);
    const width:number = defaultPosition[1] - defaultPosition[0];
    $(this.parentElement).find(".interval").css(position.size, (width + 'px'));
    $(this.parentElement).find(".interval").css(position.margin, (defaultPosition[0] + 'px'));
  }
  widthInterval(model) {
    const position = this.scale.scalePosition(model);
    const positionContainer:number = $(this.parentElement).find(".scale").offset()[position.direction];
    const thumbFirst:number = $(this.parentElement).find(".thumb:first-child").offset()[position.direction];
    const thumbSecond:number = $(this.parentElement).find(".thumb:last-child").offset()[position.direction];
    const width:number = thumbSecond - thumbFirst;
    $(this.parentElement).find(".interval").css(position.margin, (thumbFirst - positionContainer + 'px'));
    $(this.parentElement).find(".interval").css(position.size, (width + 'px'));
  }
  deleteInterval() {
    $(this.parentElement).find(".interval").remove();
  }
}