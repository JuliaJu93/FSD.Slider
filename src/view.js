import $ from 'jquery'
import  {inputsValue, i} from './model.js'

class Container {
  constructor(name) {
    this.name = name;
  }
  CreateContainer(parentElement, nameModel) {
    $(parentElement).append($('<div class="containerOfSlider"></div>'));
    let position = new Scale().ScalePosition(parentElement, nameModel);
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
    let position = new Scale().ScalePosition(parentElement, nameModel);
    $(parentElement).find(".scale").css(position[2], nameModel.sliderWidth + 16*1.35);
  }
  ScalePosition(parentElement, nameModel) {
    let direction,
      margin,
      size,
      intervalPosition,
      positionContent,
      reversePosition;
    if (nameModel.positionHorizontal){
      direction = 'left';
      margin = 'margin-left';
      size = 'width';
      intervalPosition = $(parentElement).find(".interval").css('height', (100 + '%'));
      positionContent = 'column';
      reversePosition = 'row';
    }
    else {
      direction = 'top';
      margin = 'margin-top';
      size = 'height';
      intervalPosition = $(parentElement).find(".interval").css('width', (100 + '%'));
      positionContent = 'row';
      reversePosition = 'column';
    }
    return ([direction, margin, size, intervalPosition, positionContent, reversePosition]);
  }
}

class ScaleOfValues {
  constructor(name) {
    this.name = name;
  }
  CreateScaleOfValues(parentElement, nameModel) {
    let position = new Scale().ScalePosition(parentElement, nameModel);
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
        let positionContainer = $(parentElement).find(".scale").offset()[direction];
        let start = 0;
        let end = 0;
        //Ограничения для движения слайдера с одной ручкой
        if (nameModel.oneThumb){
          start = 0;
          end = inputsValue.sliderWidth;
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
        let coord = Number.parseInt(this.style[direction]);
        if (coord + thumbDisplacement > start  && coord + thumbDisplacement < end){
        // Двигаем ручки
          this.style[direction] = coord + thumbDisplacement + 'px';
          new Interval ('interval').WidthInterval(parentElement, nameModel);
        }
      }, this) );
      $(document).mouseup(function (){
        $(document).off("mousemove");
      });
    });
  }
  //Позиция ручек по умолчанию
  DefaultPosition(parentElement, nameModel){
    let position = new Scale().ScalePosition(parentElement, nameModel);
    if (nameModel.oneThumb){
      //Пересчитываем заданное в модели значение на пиксели
      let recalculation = (nameModel.sliderWidth * nameModel.value)/(nameModel.maxRange - nameModel.minRange);
      $(parentElement).find(".thumb").css(position[0], (recalculation + 'px'));
    }
    else{
      let recalculation = [];
      recalculation[0] = (nameModel.sliderWidth * nameModel.values[0])/(nameModel.maxRange - nameModel.minRange);
      $(parentElement).find(".thumb:first-child").css(position[0], (recalculation[0] + 'px'));
      recalculation[1] = (nameModel.sliderWidth * nameModel.values[1])/(nameModel.maxRange - nameModel.minRange);
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
    let position = new Scale().ScalePosition(parentElement, nameModel);
    let defaultPosition = new Thumb ('thumbOne').DefaultPosition(parentElement, nameModel);
    let width = defaultPosition[1] - defaultPosition[0];
    $(parentElement).find(".interval").css(position[2], (width + 'px'));
    $(parentElement).find(".interval").css(position[1], (defaultPosition[0] + 'px'));
  }
  WidthInterval(parentElement, nameModel){
    let position = new Scale().ScalePosition(parentElement, nameModel);
    let positionContainer = $(parentElement).find(".scale").offset()[position[0]];
    let thumbFirst = $(parentElement).find(".thumb:first-child").offset()[position[0]];
    let thumbSecond = $(parentElement).find(".thumb:last-child").offset()[position[0]];
    let width = thumbSecond - thumbFirst;
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
    new Thumb ('thumbOne').ThumbMovement(parentElement, nameModel);
    new Thumb ('thumbOne').DefaultPosition(parentElement, nameModel);
  }
}

new Slider ('SliderOne').CreateSlider('horizontalScale', ".containerSlider", inputsValue);
new Slider ('Slidertwo').CreateSlider('jScale', ".containerSlider2", i);
new Slider ('Slidervv').CreateSlider('jSxccc', ".containerSlider3", inputsValue);


// import  {inputsValue} from './model.js'

// let range = inputsValue.maxRange - inputsValue.minRange;
// let rangeK = inputsValue.sliderWidth / range;
// let thumbRealWidth = inputsValue.thumbWidth + 2 * inputsValue.thumbBorderWidth;

// let slider = document.querySelector(".containerSlider__slider");
// slider.style.height = inputsValue.trackHeight + "px"; 
// slider.style.width = inputsValue.sliderWidth + "px";
// slider.style.paddingLeft = (inputsValue.theValue[0] - inputsValue.minRange) * rangeK + "px";
// slider.style.paddingRight = inputsValue.sliderWidth - inputsValue.theValue[1] * rangeK + "px";

// let track = document.querySelector(".track");
// track.style.width = inputsValue.theValue[1] * rangeK - inputsValue.theValue[0] * rangeK + "px";

// let thumbs = document.querySelectorAll(".thumb");
// for (let i = 0; i < thumbs.length; i++) {

//   thumbs[i].style.width = thumbs[i].style.height = inputsValue.thumbWidth + "px";
//   thumbs[i].style.borderWidth = inputsValue.thumbBorderWidth + "px";
//   thumbs[i].style.top = -(inputsValue.thumbWidth / 2 + inputsValue.thumbBorderWidth - inputsValue.trackHeight / 2) + "px";
//   thumbs[i].style.left = (inputsValue.theValue[i] - inputsValue.minRange) * rangeK - (thumbRealWidth / 2) + "px";

// }
// let outputs = document.querySelectorAll(".output");
// for (let i = 0; i < outputs.length; i++) {
//   outputs[i].style.width = outputs[i].style.height = outputs[i].style.lineHeight = outputs[i].style.left = inputsValue.outputWidth + "px";
//   outputs[i].style.top = -(Math.sqrt(2 * inputsValue.outputWidth * inputsValue.outputWidth) + inputsValue.thumbWidth / 2 - inputsValue.trackHeight / 2) + "px";
//   outputs[i].style.left = (inputsValue.theValue[i] - inputsValue.minRange) * rangeK - inputsValue.outputWidth / 2 + "px";
//   outputs[i].innerHTML = "<p>" + inputsValue.theValue[i] +'₽' + "</p>";
// }

// let isDragging0 = false;
// let isDragging1 = false;

// let container = document.querySelector(".containerSlider");

// //events

// thumbs[0].addEventListener("mousedown", function(evt) {
//   isDragging0 = true;
// }, false);
// thumbs[1].addEventListener("mousedown", function(evt) {
//   isDragging1 = true;
// }, false);
// container.addEventListener("mouseup", function(evt) {
//   isDragging0 = false;
//   isDragging1 = false;
// }, false);
// container.addEventListener("mouseout", function(evt) {
//   isDragging0 = false;
//   isDragging1 = false;
// }, false);

// container.addEventListener("mousemove", function(evt) {
//   let mousePos = oMousePos(this, evt);
//   let theValue0 = (isDragging0) ? Math.round(mousePos.x / rangeK) + inputsValue.minRange : inputsValue.theValue[0];
//   let theValue1 = (isDragging1) ? Math.round(mousePos.x / rangeK) + inputsValue.minRange : inputsValue.theValue[1];

//   if (isDragging0) {

//     if (theValue0 < theValue1 - (thumbRealWidth / 2) &&
//       theValue0 >= inputsValue.minRange) {
//       inputsValue.theValue[0] = theValue0;
//       thumbs[0].style.left = (theValue0 - inputsValue.minRange) * rangeK - (thumbRealWidth / 2) + "px";
//       outputs[0].style.left = (theValue0 - inputsValue.minRange) * rangeK - inputsValue.outputWidth / 2 + "px";
//       outputs[0].innerHTML = "<p>" + theValue0 + '₽' + "</p>";
//       slider.style.paddingLeft = (theValue0 - inputsValue.minRange) * rangeK + "px";
//       track.style.width = (theValue1 - theValue0) * rangeK + "px";

//     }
//   } else if (isDragging1) {

//     if (theValue1 > theValue0 + (thumbRealWidth / 2) &&
//       theValue1 <= inputsValue.maxRange) {
//       inputsValue.theValue[1] = theValue1;
//       thumbs[1].style.left = (theValue1 - inputsValue.minRange) * rangeK - (thumbRealWidth / 2) + "px";
//       outputs[1].style.left = (theValue1 - inputsValue.minRange) * rangeK - inputsValue.outputWidth / 2 + "px";
//       outputs[1].innerHTML = "<p>" + theValue1 + '₽' + "</p>";
//       slider.style.paddingRight = (inputsValue.maxRange - theValue1) * rangeK + "px";
//       track.style.width = (theValue1 - theValue0) * rangeK + "px";
//     }
//   }

// }, false);

// function oMousePos(elmt, evt) {
//   let ClientRect = elmt.getBoundingClientRect();
//   return { 
//     x: Math.round(evt.clientX - ClientRect.left),
//     y: Math.round(evt.clientY - ClientRect.top)
//   }
// }