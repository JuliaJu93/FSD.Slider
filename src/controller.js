import $ from 'jquery'
import  {inputsValue} from './model.js'
import {thumbs, rangeK, thumbRealWidth, outputs, slider, track} from './view.js'

console.log(inputsValue.minRange)

  let isDragging0 = false;
  let isDragging1 = false;

  let container = document.querySelector(".containerSlider");
  
  //events
  
  thumbs[0].addEventListener("mousedown", function(evt) {
    isDragging0 = true;
  }, false);
  thumbs[1].addEventListener("mousedown", function(evt) {
    isDragging1 = true;
  }, false);
  container.addEventListener("mouseup", function(evt) {
    isDragging0 = false;
    isDragging1 = false;
  }, false);
  container.addEventListener("mouseout", function(evt) {
    isDragging0 = false;
    isDragging1 = false;
  }, false);
  
  container.addEventListener("mousemove", function(evt) {
    let mousePos = oMousePos(this, evt);
    let theValue0 = (isDragging0) ? Math.round(mousePos.x / rangeK) + inputsValue.minRange : inputsValue.theValue[0];
    let theValue1 = (isDragging1) ? Math.round(mousePos.x / rangeK) + inputsValue.minRange : inputsValue.theValue[1];
  
    if (isDragging0) {
  
      if (theValue0 < theValue1 - (thumbRealWidth / 2) &&
        theValue0 >= inputsValue.minRange) {
        inputsValue.theValue[0] = theValue0;
        thumbs[0].style.left = (theValue0 - inputsValue.minRange) * rangeK - (thumbRealWidth / 2) + "px";
        outputs[0].style.left = (theValue0 - inputsValue.minRange) * rangeK - inputsValue.outputWidth / 2 + "px";
        outputs[0].innerHTML = "<p>" + theValue0 + '₽' + "</p>";
        slider.style.paddingLeft = (theValue0 - inputsValue.minRange) * rangeK + "px";
        track.style.width = (theValue1 - theValue0) * rangeK + "px";
  
      }
    } else if (isDragging1) {
  
      if (theValue1 > theValue0 + (thumbRealWidth / 2) &&
        theValue1 <= inputsValue.maxRange) {
        inputsValue.theValue[1] = theValue1;
        thumbs[1].style.left = (theValue1 - inputsValue.minRange) * rangeK - (thumbRealWidth / 2) + "px";
        outputs[1].style.left = (theValue1 - inputsValue.minRange) * rangeK - inputsValue.outputWidth / 2 + "px";
        outputs[1].innerHTML = "<p>" + theValue1 + '₽' + "</p>";
        slider.style.paddingRight = (inputsValue.maxRange - theValue1) * rangeK + "px";
        track.style.width = (theValue1 - theValue0) * rangeK + "px";
      }
    }
  
  }, false);

  function oMousePos(elmt, evt) {
    let ClientRect = elmt.getBoundingClientRect();
    return { 
      x: Math.round(evt.clientX - ClientRect.left),
      y: Math.round(evt.clientY - ClientRect.top)
    }
  }