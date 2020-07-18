let $ = require ('jquery')
import  {Model} from './model.js'
import  {ControlPanel} from './controller.js'

class Container {
  name:string;
  parentElement:string;
  scale:Scale;
  constructor(_name, _scale, _parentElement) {
    this.name = _name;
    this.parentElement = _parentElement;
    this.scale = _scale;
  }
  createContainer() {
    $(this.parentElement).append($('<div class="containerOfSlider"></div>'));
    const position = this.scale.scalePosition();
    $(this.parentElement).find(".containerOfSlider").css('flex-direction', position.positionContent);
  }
  deleteContainer() {
    $(this.parentElement).find(".containerOfSlider").remove();
  }
}

//Создание Шкалы произвольной ширины, с возможностью изменять ее позицию (горизонтальная или вертикальная)
class Scale {
  name:string;
  parentElement:string;
  nameModel:Model;
  constructor(_name, _parentElement, _nameModel) {
    this.name = _name;
    this.parentElement = _parentElement;
    this.nameModel = _nameModel;
  }
  createScale() {
    $(this.parentElement).find(".containerOfSlider").append($('<div class="scale"></div>'));
    const position = this.scalePosition();
    $(this.parentElement).find(".scale").css(position.size, this.nameModel.sliderWidth + 16);
  }
  //Пересчет значений в модели на пиксели;
  countToPixels(){
    let recalculation:Array<number> = [];
    const UnitRatio:number = this.nameModel.sliderWidth/(this.nameModel.maxRange-this.nameModel.minRange);
    if(this.nameModel.oneThumb){
      recalculation[0] = (this.nameModel.value-this.nameModel.minRange)*UnitRatio;
    }
    else {
      recalculation[0] = (this.nameModel.values[0]-this.nameModel.minRange)*UnitRatio;
      recalculation[1] = (this.nameModel.values[1]-this.nameModel.minRange)*UnitRatio;
    }
    return recalculation;
  }
  // Параметры, которые зависят от положения шкалы
  scalePosition() {
    let direction:string,
      margin:string,
      size:string,
      intervalPosition:string,
      positionContent:string,
      reversePosition:string;
    if (this.nameModel.positionHorizontal){
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
class ScaleOfValues {
  name: string;
  parentElement: string;
  nameModel: Model;
  scale: Scale;
  constructor(_name, _scale, _parentElement, _nameModel) {
    this.name = _name;
    this.parentElement = _parentElement;
    this.nameModel = _nameModel;
    this.scale = _scale;
  }
  createScaleOfValues() {
    const position = this.scale.scalePosition();
    $(this.parentElement).find(".scale").after($('<div class="scaleOfValues"></div>'));
    $(this.parentElement).find(".scaleOfValues").css(position.size, this.nameModel.sliderWidth + 16*1.35);
    $(this.parentElement).find(".scaleOfValues").css('flex-direction', position.reversePosition);
    $(this.parentElement).find(".scaleOfValues").append($('<p></p>'));
    $(this.parentElement).find(".scaleOfValues").append($('<p></p>'));
    if (position.positionContent === 'row'){
      $(this.parentElement).find("p").css('margin', '0 1rem');
    }
    $(this.parentElement).find("p:first-child").text(this.nameModel.minRange);
    $(this.parentElement).find("p:last-child").text(this.nameModel.maxRange);
  }
  deleteScaleOfValues() {
    $(this.parentElement).find(".scaleOfValues").remove();
  }
}

//Значение над ручками
class ElementText {
  name: string;
  parentElement: string;
  nameModel: Model;
  scale: Scale;
  constructor(_name, _scale, _parentElement, _nameModel) {
    this.name = _name;
    this.parentElement = _parentElement;
    this.nameModel = _nameModel;
    this.scale = _scale;
  }
  createElementText() {
    const elementFirst = $(this.parentElement).find(".thumb:first-child")[0];
    const elementSecond = $(this.parentElement).find(".thumb:last-child")[0];
    if (this.nameModel.elementText){
      if (this.nameModel.oneThumb){
        elementFirst.dataset.element = this.nameModel.value;
      }
      else {
        elementFirst.dataset.element = this.nameModel.values[0];
        elementSecond.dataset.element = this.nameModel.values[1];
      }
    }
    else {
      if (this.nameModel.oneThumb){
        elementFirst.dataset.element = '';
      }
      else {
        elementFirst.dataset.element = '';
        elementSecond.dataset.element = '';
      }
    }
  }
  changeValueElement(thumb, direction){
    let value:number;
    if (this.nameModel.elementText && direction !== false) { 
      if (this.nameModel.oneThumb){
        value = +($(this.parentElement).find(".thumb:first-child")[0].dataset.element) + +this.nameModel.step*direction;
        $(this.parentElement).find(".thumb:first-child")[0].dataset.element = value;
      }
      else {
        if (thumb === $(this.parentElement).find(".thumb:first-child")[0]) {
          if (this.nameModel.elementText) {  
            value = +($(this.parentElement).find(".thumb:first-child")[0].dataset.element) + +this.nameModel.step*direction;
            $(this.parentElement).find(".thumb:first-child")[0].dataset.element = value;
          }
        }
        else {
          if (this.nameModel.elementText) { 
            value = +($(this.parentElement).find(".thumb:last-child")[0].dataset.element) + +this.nameModel.step*direction;
            $(this.parentElement).find(".thumb:last-child")[0].dataset.element = value;
          }
        }
      }
    }
    else {
      if (this.nameModel.oneThumb){
        value = this.nameModel.value + +this.nameModel.step*direction;
        if (direction === false && this.nameModel.elementText) {
          $(this.parentElement).find(".thumb:first-child")[0].dataset.element = this.nameModel.value;
        }
      }
      else {
        if (thumb === $(this.parentElement).find(".thumb:first-child")[0]) {
          value = this.nameModel.values[0] + +this.nameModel.step*direction;
          if (direction === false && this.nameModel.elementText) {
            $(this.parentElement).find(".thumb:first-child")[0].dataset.element = this.nameModel.values[0];
          }
        }
        else {
          value = this.nameModel.values[1] + +this.nameModel.step*direction;
          if (direction === false && this.nameModel.elementText) {
            $(this.parentElement).find(".thumb:last-child")[0].dataset.element = this.nameModel.values[1];
          }
        }
      }
    }
    //Публикация
    $(document).trigger("onclick", [value, thumb, this.nameModel, this.parentElement]);
  }
}

// Ручки
class Thumb {
  name: string;
  parentElement: string;
  nameModel: Model;
  scale: Scale;
  interval: Interval;
  elementText: ElementText;
  constructor(_name, _scale, _interval, _elementText, _parentElement, _nameModel) {
    this.name = _name;
    this.parentElement = _parentElement;
    this.nameModel = _nameModel;
    this.scale = _scale;
    this.interval = _interval;
    this.elementText = _elementText;
  }
  createThumb() {
    $(this.parentElement).find(".scale").append($('<span class="thumb"></span>'));
    if (this.nameModel.positionHorizontal) {
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
      $(document).mousemove((event: MouseEvent) => {
      //В зависимости от горизонтального или вертикального положения шкалы выбираем траекторию движения ручки
      let direction:string,
      cursorPosition:number;
      if (this.nameModel.positionHorizontal){
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
        const recalculation = (this.nameModel.maxRange-this.nameModel.minRange) / this.nameModel.step;
        //количество пикселей в одном шаге
        let step:number = Math.trunc(this.nameModel.sliderWidth / recalculation);
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
        const coord:number = Number.parseInt((thumb as HTMLElement).style[direction]);
        if (cursorPosition > coord + step){
          if (coord + step >= start  && coord + step <= end) {
            // Двигаем ручки вперед
            (thumb as HTMLElement).style[direction] = coord + step + 'px';
            this.elementText.changeValueElement(thumb, 1);
          }
        }
        else if(cursorPosition < coord - step){
          if (coord - step >= start  && coord - step <= end) {
            // Двигаем ручки назад
            (thumb as HTMLElement).style[direction] = coord - step + 'px';
            this.elementText.changeValueElement(thumb, -1);
          }
        }
        this.interval.widthInterval();
      });
      $(document).mouseup(function (){
        $(document).off("mousemove");
      });
    });
  }
  //Позиция ручек по умолчанию
  defaultPosition() {
    const recalculation:Array<number> = this.scale.countToPixels();
    const position = this.scale.scalePosition();
    if (this.nameModel.oneThumb){
      $(this.parentElement).find(".thumb:first-child").css(position.direction, (recalculation + 'px'));
    }
    else {
      $(this.parentElement).find(".thumb:first-child").css(position.direction, (recalculation[0] + 'px'));
      $(this.parentElement).find(".thumb:last-child").css(position.direction, (recalculation[1] + 'px'));
    }
    this.interval.widthInterval();
  }
  deleteThumb() {
    $(this.parentElement).find(".thumb").remove();
  }
}

//Создание закрашенного интервала между двумя ручками интервального ползунка
class Interval {
  name: string;
  parentElement: string;
  nameModel: Model;
  scale: Scale;
  constructor(_name, _scale, _parentElement, _nameModel) {
    this.name = _name;
    this.scale = _scale;
    this.parentElement = _parentElement;
    this.nameModel = _nameModel;
  }
  createInterval() {
    $(this.parentElement).find(".thumb:first-child").after($('<div class="interval"></div>'));
    const position = this.scale.scalePosition();
    const defaultPosition:Array<number> = this.scale.countToPixels();
    const width:number = defaultPosition[1] - defaultPosition[0];
    $(this.parentElement).find(".interval").css(position.size, (width + 'px'));
    $(this.parentElement).find(".interval").css(position.margin, (defaultPosition[0] + 'px'));
  }
  widthInterval() {
    const position = this.scale.scalePosition();
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

//Создание ползунка
export class Slider {
  nameSlider : string;
  nameScale:string;
  parentElement:string;
  model: Model;
  panel: ControlPanel;
  nameModel:Model;
  scale:Scale;
  container:Container;
  interval:Interval;
  elementText:ElementText;
  scaleOfValues:ScaleOfValues;
  singleThumb:Thumb;
  doubleThumb1:Thumb;
  doubleThumb2:Thumb;
  constructor(_slider, _model, _panel) {
    this.nameSlider = _slider.nameSlider;
    this.parentElement = _slider.parentElement;
    this.nameModel = _slider.nameModel;
    this.model =  new Model (_model);
    this.panel = new ControlPanel (_panel, _model,_slider);
    this.scale = new Scale (_slider.nameScale, _slider.parentElement, this.model);
    this.container = new Container ('container', this.scale, _slider.parentElement);
    this.interval = new Interval ('interval', this.scale, _slider.parentElement, this.model);
    this.elementText = new ElementText ('element', this.scale, _slider.parentElement, this.model);
    this.scaleOfValues = new ScaleOfValues (_slider.nameScale, this.scale, _slider.parentElement, this.model);
    this.singleThumb = new Thumb ('thumbOne', this.scale, this.interval, this.elementText, _slider.parentElement, this.model);
    this.doubleThumb1 = new Thumb ('thumbOne', this.scale, this.interval, this.elementText, _slider.parentElement, this.model);
    this.doubleThumb2 = new Thumb ('thumbTwo', this.scale, this.interval, this.elementText, _slider.parentElement, this.model);
  }
  createSlider() {
    this.panel.createControlPanel();
    this.container.createContainer();
    this.scale.createScale();
    this.scaleOfValues.createScaleOfValues();
    if (this.model.oneThumb){
      this.singleThumb.createThumb();
    }
    else {
      this.doubleThumb1.createThumb();
      this.doubleThumb2.createThumb();
      this.interval.createInterval();
    }
    this.elementText.createElementText();
    this.doubleThumb1.thumbMovement();
    this.doubleThumb1.defaultPosition();
  }
}

export let slider1:Slider = new Slider ({nameSlider:'SliderOne', nameScale:'Scale1', parentElement:".container1"}, {nameModel: 'model1', sliderWidth: 300, positionHorizontal: true, minRange: 40, maxRange: 100, oneThumb: false, values: [50, 80], value: 80, step: 5, elementText: true}, {namePanel:'panel1', panelParentElement:".containerPanel1"});
slider1.createSlider();

let slider2:Slider = new Slider ({nameSlider:'SliderTwo', nameScale:'Scale2', parentElement:".container2"}, {name: 'model2', sliderWidth: 200, positionHorizontal: false, minRange: 0, maxRange: 100, oneThumb: false, values: [40, 50], value: 60, step: 1, elementText: true}, {namePanel:'panel2', panelParentElement:".containerPanel2"});
slider2.createSlider();

let slider3:Slider = new Slider ({nameSlider:'SliderThree', nameScale:'Scale3', parentElement:".container3"}, {name: 'model3', sliderWidth: 400, positionHorizontal: true, minRange: 10, maxRange: 200, oneThumb: true, values: [50, 180], value: 80, step: 40, elementText: false}, {namePanel:'panel3', panelParentElement:".containerPanel3"});
slider3.createSlider();