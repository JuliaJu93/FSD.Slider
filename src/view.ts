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
      if(this.nameModel.oneThumb){
        elementFirst.dataset.element = this.nameModel.value;
      }
      else{
        elementFirst.dataset.element = this.nameModel.values[0];
        elementSecond.dataset.element = this.nameModel.values[1];
      }
    }
    else {
      if(this.nameModel.oneThumb){
        elementFirst.dataset.element = '';
      }
      else{
        elementFirst.dataset.element = '';
        elementSecond.dataset.element = '';
      }
    }
  }
  changeValueElement(thumb){
    const position = this.scale.scalePosition();
    const positionContainer:number = $(this.parentElement).find(".scale").offset()[position.direction];
    const thumbFirst:number = $(this.parentElement).find(".thumb:first-child").offset()[position.direction];
    const thumbSecond:number = $(this.parentElement).find(".thumb:last-child").offset()[position.direction];
    let value:number;
    const UnitRatio:number = this.nameModel.sliderWidth/(this.nameModel.maxRange-this.nameModel.minRange);
    if (this.nameModel.oneThumb){
      value = Math.trunc(((thumbFirst-positionContainer)/UnitRatio) + this.nameModel.minRange);
      if (this.nameModel.elementText) { 
      $(this.parentElement).find(".thumb:first-child")[0].dataset.element = value;
      }
    }
    else {
      if (thumb === $(this.parentElement).find(".thumb:first-child")[0]) {
        value = Math.trunc(((thumbFirst-positionContainer)/UnitRatio) + this.nameModel.minRange);
        if (this.nameModel.elementText) {  
        $(this.parentElement).find(".thumb:first-child")[0].dataset.element = value;
        }
      }
      else {
        value = Math.trunc(((thumbSecond-positionContainer)/UnitRatio) + this.nameModel.minRange); 
        if (this.nameModel.elementText) { 
        $(this.parentElement).find(".thumb:last-child")[0].dataset.element = value;
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
          if (coord + step >= start  && coord + step <= end){
            // Двигаем ручки вперед
            (thumb as HTMLElement).style[direction] = coord + step + 'px';
          }
        }
        else if(cursorPosition < coord - step){
          if (coord - step >= start  && coord - step <= end){
            // Двигаем ручки назад
            (thumb as HTMLElement).style[direction] = coord - step + 'px';
          }
        }
        this.elementText.changeValueElement(thumb);
        this.interval.widthInterval();
      });
      $(document).mouseup(function (){
        $(document).off("mousemove");
      });
    });
  }
  //Позиция ручек по умолчанию
  defaultPosition(){
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
  widthInterval(){
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
  name : string;
  nameScale:string;
  parentElement:string;
  nameModel:Model;
  scale:Scale;
  container:Container;
  interval:Interval;
  elementText:ElementText;
  scaleOfValues:ScaleOfValues;
  singleThumb:Thumb;
  doubleThumb1:Thumb;
  doubleThumb2:Thumb;
  constructor(_name, _nameScale, _parentElement, _nameModel) {
    this.name = _name;
    this.parentElement = _parentElement;
    this.nameModel = _nameModel;
    this.scale = new Scale (_nameScale, _parentElement, _nameModel);
    this.container = new Container ('container', this.scale, _parentElement);
    this.interval = new Interval ('interval', this.scale, _parentElement, _nameModel);
    this.elementText = new ElementText ('element', this.scale, _parentElement, _nameModel);
    this.scaleOfValues = new ScaleOfValues (_nameScale, this.scale, _parentElement, _nameModel);
    this.singleThumb = new Thumb ('thumbOne', this.scale, this.interval, this.elementText, _parentElement, _nameModel);
    this.doubleThumb1 = new Thumb ('thumbOne', this.scale, this.interval, this.elementText, _parentElement, _nameModel);
    this.doubleThumb2 = new Thumb ('thumbTwo', this.scale, this.interval, this.elementText, _parentElement, _nameModel);
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
    this.elementText.createElementText();
    this.doubleThumb1.thumbMovement();
    this.doubleThumb1.defaultPosition();
  }
}

let model1:Model  = new Model ({name: 'model1', sliderWidth: 400, positionHorizontal: true, minRange: 0, maxRange: 200, oneThumb: false, values: [50, 180], value: 180, step: 10, elementText: true});
let slider1 = new Slider ('SliderOne', 'Scale1', ".container1", model1);
slider1.createSlider();
let controlPanel1 = new ControlPanel ('panel1', ".containerPanel1", model1, slider1);
controlPanel1.createControlPanel();

let model2:Model  = new Model ({name: 'model2', sliderWidth: 200, positionHorizontal: false, minRange: 30, maxRange: 100, oneThumb: false, values: [40, 50], value: 60, step: 1, elementText: true});
let slider2 = new Slider ('Slidertwo', 'Scale2', ".container2", model2);
slider2.createSlider();
let controlPanel2 = new ControlPanel ('panel2', ".containerPanel2", model2, slider2);
controlPanel2.createControlPanel();


let model3:Model = new Model ({name: 'model3', sliderWidth: 400, positionHorizontal: true, minRange: 10, maxRange: 400, oneThumb: true, values: [150, 380], value: 280, step: 40, elementText: false});
let slider3 = new Slider ('Slidervv', 'Scale3', ".container3", model3);
slider3.createSlider();
let controlPanel3 = new ControlPanel ('panel3', ".containerPanel3", model3, slider3);
controlPanel3.createControlPanel();