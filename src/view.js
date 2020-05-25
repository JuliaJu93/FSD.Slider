import  {inputsValue} from './model.js'

let range = inputsValue.maxRange - inputsValue.minRange;
  let rangeK = inputsValue.sliderWidth / range;
  let thumbRealWidth = inputsValue.thumbWidth + 2 * inputsValue.thumbBorderWidth;

let slider = document.querySelector(".containerSlider__slider");
slider.style.height = inputsValue.trackHeight + "px";
slider.style.width = inputsValue.sliderWidth + "px";
slider.style.paddingLeft = (inputsValue.theValue[0] - inputsValue.minRange) * rangeK + "px";
slider.style.paddingRight = inputsValue.sliderWidth - inputsValue.theValue[1] * rangeK + "px";

let track = document.querySelector(".track");
track.style.width = inputsValue.theValue[1] * rangeK - inputsValue.theValue[0] * rangeK + "px";

let thumbs = document.querySelectorAll(".thumb");
for (let i = 0; i < thumbs.length; i++) {

  thumbs[i].style.width = thumbs[i].style.height = inputsValue.thumbWidth + "px";
  thumbs[i].style.borderWidth = inputsValue.thumbBorderWidth + "px";
  thumbs[i].style.top = -(inputsValue.thumbWidth / 2 + inputsValue.thumbBorderWidth - inputsValue.trackHeight / 2) + "px";
  thumbs[i].style.left = (inputsValue.theValue[i] - inputsValue.minRange) * rangeK - (thumbRealWidth / 2) + "px";

}
let outputs = document.querySelectorAll(".output");
for (let i = 0; i < outputs.length; i++) {
  outputs[i].style.width = outputs[i].style.height = outputs[i].style.lineHeight = outputs[i].style.left = inputsValue.outputWidth + "px";
  outputs[i].style.top = -(Math.sqrt(2 * inputsValue.outputWidth * inputsValue.outputWidth) + inputsValue.thumbWidth / 2 - inputsValue.trackHeight / 2) + "px";
  outputs[i].style.left = (inputsValue.theValue[i] - inputsValue.minRange) * rangeK - inputsValue.outputWidth / 2 + "px";
  outputs[i].innerHTML = "<p>" + inputsValue.theValue[i] +'₽' + "</p>";
}

export {thumbs, rangeK, thumbRealWidth, outputs, slider, track};