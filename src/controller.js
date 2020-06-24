import $ from 'jquery'
import {Model} from './model.js'

//Подписчик для View. Получает значение над ручкой ползунка и устанавливает его в панель управления
$(document).on("onclick", function(event, value, thumb, nameModel, parentElement) {
    const panel =  $(parentElement).siblings()[0];
    const parentId =  $(panel).attr('id');
    if (nameModel.oneThumb) {
        nameModel.value = value;
        $(panel).find(`#value-${parentId}`).val(value);
    }
    else {
      if (thumb === $(parentElement).find(".thumb:first-child")[0]){
        nameModel.values[0] = value;
        $(panel).find(`#values1-${parentId}`).val(value);
      }  
      else {
        nameModel.values[1] = value;
        $(panel).find(`#values2-${parentId}`).val(value);
      } 
    }
});

// Пересохраняем данные в модели при вводе значений в панель управления и обновляем слайдер
function setParameter(nameModel, target, parentId, slider) {
  let handler = {};
  nameModel = new Proxy (nameModel, handler);
  switch (target.id) {
    case `position-${parentId}`:
      handler = {
        set: nameModel.positionHorizontal = $(target).prop("checked")
      }
      slider.scale.createScale();
      slider.scale.scalePosition();  
    break  
    case `values1-${parentId}`:
      handler = {
        set: nameModel.values[0] = target.value
      } 
      slider.singleThumb.defaultPosition();
      slider.elementText.changeValueElement();
    break
    case `values2-${parentId}`:
      handler = {
        set: nameModel.values[1] = target.value
      } 
      slider.singleThumb.defaultPosition();
      slider.elementText.changeValueElement();
    break
    case `value-${parentId}`:
      handler = {
        set: nameModel.value = target.value
      } 
      slider.singleThumb.defaultPosition();
      slider.elementText.changeValueElement();
    break
  }
}

//Создание панели управления
export class ControlPanel {
  constructor(name, parentElement, nameModel, slider) {
    this.name = name;
    this.parentElement = parentElement;
    this.nameModel = nameModel;
    this.slider = slider;
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
    this.setValue(parentId);

    $(this.parentElement).append($('<div class="containerRow"></div>'));
    $(this.parentElement).find(".containerRow:nth-child(6)").append($(`<label for="values1-${parentId}"></label>`));
    $(this.parentElement).find(".containerRow:nth-child(6) label").text('Thumbs values');
    this.setValues(parentId);

    $(this.parentElement).append($('<div class="containerRow"></div>'));
    $(this.parentElement).find(".containerRow:nth-child(7)").append($(`<label for="step-${parentId}"></label>`));
    $(this.parentElement).find(".containerRow:nth-child(7) label").text('Step');
    $(this.parentElement).find(".containerRow:nth-child(7)").append($(`<input id="step-${parentId}" type=number value=${this.nameModel.step} min=1></input>`));

    $(this.parentElement).append($('<div class="containerRow"></div>'));
    $(this.parentElement).find(".containerRow:nth-child(8)").append($(`<label for="text-${parentId}"></label>`));
    $(this.parentElement).find(".containerRow:nth-child(8) label").text('Value above the thumb');
    let element; 
    if (this.nameModel.elementText){
      element = 'checked';
    }
    $(this.parentElement).find(".containerRow:nth-child(8)").append($(`<input id="text-${parentId}" type=checkbox ${element}></input>`));
    this.dataInput(this.slider);
  }
  dataInput(slider){
    $("input").change(()=> {
      const parentId =  $(this.parentElement).attr('id');
      setParameter(this.nameModel, event.target, parentId, this.slider);
    });
  }
  setValue(parentId) {
    $(this.parentElement).find(".containerRow:nth-child(5)").append($(`<input id="value-${parentId}" type=number value=${this.nameModel.value} min=0></input>`));
  }
  setValues(parentId) {
    $(this.parentElement).find(".containerRow:nth-child(6)").append($(`<input id="values1-${parentId}" type=number value=${this.nameModel.values[0]} min=0></input>`));
    $(this.parentElement).find(".containerRow:nth-child(6)").append($(`<input id="values2-${parentId}"type=number value=${this.nameModel.values[1]} min=0></input>`));
  }
}