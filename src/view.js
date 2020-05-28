import $ from 'jquery'
import  {inputsValue} from './model.js'

//Создание Шкалы произвольной ширины, с возможностью изменять ее позитию (горизонтальная или вертикальная)
class Scale {
  constructor(name) {
    this.name = name;
  }
  CreateScale() {
    $(".containerSlider").append($('<div class="scale"></div>'));
    if (inputsValue.positionHorizontal === true){
      $(".scale").css('width', inputsValue.sliderWidth);
    }
    else {
      $(".scale").css('height', inputsValue.sliderWidth);
    } 
  }
}

// Ползунок
class Thumb {
  constructor(name) {
  }
  CreateThumb() {
    $(".scale").append($('<span class="thumb thumb_type_1" ></span>'));
    if (inputsValue.positionHorizontal === true){
      $(".thumb").css("bottom", ("-7px"));
    }
    else {
      $(".thumb").css("left", ("-7px"));
    }
  }
  ThumbMovement() {
    $(".thumb").mousedown(function (){
      $(document).mousemove($.proxy(function (){
        let thumbDisplacement = 0;
        let direction = 0;
        if (inputsValue.positionHorizontal === true){
          thumbDisplacement = event.clientX;
          direction = 'left';
        }
        else {
          thumbDisplacement = event.clientY;
          direction = 'top';
        }
        let positionContainerLeft = $(".scale").offset().left;
        if (thumbDisplacement >= inputsValue.sliderWidth+positionContainerLeft - 16*1.35){
          thumbDisplacement = inputsValue.sliderWidth+positionContainerLeft - 16*1.35;
        }
        else if (thumbDisplacement <= positionContainerLeft){
          thumbDisplacement = positionContainerLeft;
        }
        $(this).css(direction, (thumbDisplacement - positionContainerLeft) +'px');
      }, this) );
      $(document).mouseup(function (){
        $(document).off("mousemove");
      });
    });
  }
}

class Slider {
  constructor(name) {
    this.name = name;
  }
  CreateSlider() {
    new Scale ('horizontalScale').CreateScale();
    if (inputsValue.oneThumb === true){
      new Thumb ('thumbOne').CreateThumb();
    }
    else{
      new Thumb ('thumbOne').CreateThumb();
      new Thumb ('thumbTwo').CreateThumb();
    }
    new Thumb ('thumbOne').ThumbMovement();
  }
}

new Slider ('SliderOne').CreateSlider();




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