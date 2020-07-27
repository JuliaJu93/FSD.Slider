let $ = require ('jquery')
import  {Model} from './model.js'
import  {Slider} from './view.js'

//Подписчик для View. Получает значение над ручкой ползунка и устанавливает его в панель управления
$(document).on("onclick", function(event:Event, value:number, thumb:HTMLElement, nameModel:Model, parentElement:string) {
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
export function setParameter (model:Model, target, parentId:string, slider:Slider, parentElement) {
  let handler:object = {};
  model = new Proxy (model, handler);
  switch (target.id) {
    case `position-${parentId}`:
      handler = {
        set: model.positionHorizontal = $(target).prop("checked")
      }
      slider.container.deleteContainer();
      slider.createSlider();
    break
    case `min-${parentId}`:
      handler = {
        set: model.minRange = +target.value
      }
      if (model.minRange < model.maxRange) {
      //Проверки на изменения минимума
        if (model.minRange > model.value) {
          model.value = model.minRange;
          $(`#value-${parentId}`).val(model.minRange);
        }
        if (model.minRange > model.values[0]) {
          model.values[0] = model.minRange;
          $(`#values1-${parentId}`).val(model.minRange);
        }
        if (model.minRange > model.values[1]) {
          model.values[1] = model.maxRange;
          $(`#values2-${parentId}`).val(model.maxRange);
        }
        slider.container.deleteContainer();
        slider.createSlider();
      }
      else {
        handler = {
          set: model.minRange = 0
        }
        $(`#min-${parentId}`).val(0);
        slider.container.deleteContainer();
        slider.createSlider();
      }
    break
    case `max-${parentId}`:
      handler = {
        set: model.maxRange = +target.value
      }
      if (model.minRange < model.maxRange) {
      //Проверки на изменения максимума
        if (model.maxRange < model.value) {
          model.value = model.maxRange;
          $(`#value-${parentId}`).val(model.maxRange);
        }
        if (model.maxRange < model.values[1]) {
          model.values[1] = model.maxRange;
          $(`#values2-${parentId}`).val(model.maxRange);
        }
        if (model.maxRange < model.values[0]) {
          model.values[0] = model.minRange;
          $(`#values1-${parentId}`).val(model.minRange);
        }
        slider.container.deleteContainer();
        slider.createSlider();
      }
      else {
        if (model.maxRange < 0) {
          model.maxRange *= -1;
        }
        handler = {
          set: model.maxRange = +model.maxRange + +model.minRange
        }
        if (model.maxRange > model.minRange) {
          if (model.maxRange < model.value) {
            model.value = model.maxRange;
            $(`#value-${parentId}`).val(model.maxRange);
          }
          if (model.maxRange < model.values[1]) {
            model.values[1] = model.maxRange;
            $(`#values2-${parentId}`).val(model.maxRange);
          }
        }
        $(`#max-${parentId}`).val(model.maxRange);
        slider.container.deleteContainer();
        slider.createSlider();
      }
    break
    case `thumb-${parentId}`:
      handler = {
        set: model.oneThumb = $(target).prop("checked")
      }
      if (slider.model.oneThumb){
        slider.interval.deleteInterval();
        slider.singleThumb.deleteThumb();
        slider.singleThumb.createThumb();
      }
      else {
        slider.singleThumb.deleteThumb();
        slider.doubleThumb1.createThumb();
        slider.doubleThumb2.createThumb();
        slider.interval.createInterval();
      }
      slider.elementText.createElementText();
      slider.doubleThumb1.thumbMovement();
      slider.doubleThumb1.defaultPosition();
    break  
    case `values1-${parentId}`:
      if ((+target.value <= model.maxRange) && (+target.value >= model.minRange) && (+target.value < model.values[1])){
      handler = { 
        set: model.values[0] = +target.value
      } 
      }
      else if (+target.value > model.maxRange) {
        handler = {
          set: model.values[0] = model.maxRange
        }
        $(`#values1-${parentId}`).val(model.maxRange);
      }
      else if (+target.value < model.minRange) {
        handler = {
          set: model.values[0] = model.minRange
        } 
        $(`#values1-${parentId}`).val(model.minRange);
      }
      slider.singleThumb.defaultPosition();
      slider.elementText.changeValueElement(parentElement.find(".thumb:first-child")[0], false);
    break
    case `values2-${parentId}`:
      if ((+target.value <= model.maxRange) && (+target.value >= model.minRange) && (+target.value > model.values[0])){
      handler = {
        set: model.values[1] = +target.value
      } 
      }
      else if (+target.value > model.maxRange) {
        handler = {
          set: model.values[1] = model.maxRange
        }
        $(`#values2-${parentId}`).val(model.maxRange);
      }
      else if (+target.value < model.minRange) {
        handler = {
          set: model.values[1] = model.minRange
        } 
        $(`#values2-${parentId}`).val(model.minRange);
      }
      slider.singleThumb.defaultPosition();
      slider.elementText.changeValueElement(parentElement.find(".thumb:first-child")[1], false);
    break
    case `value-${parentId}`:
      if ((+target.value <= model.maxRange) && (+target.value >= model.minRange)) {
      handler = {
        set: model.value = +target.value
      } 
      }
      else if (+target.value > model.maxRange) {
        handler = {
          set: model.value = model.maxRange 
        }
        $(`#value-${parentId}`).val(model.maxRange);
      }
      else if (+target.value < model.minRange) {
        handler = {
          set: model.value = model.minRange
        } 
        $(`#value-${parentId}`).val(model.minRange);
      }
      slider.singleThumb.defaultPosition();
      slider.elementText.changeValueElement(parentElement.find(".thumb:first-child")[1], false);
    break
    case `step-${parentId}`:
      handler = {
        set: model.step = +target.value
      }
      slider.singleThumb.thumbMovement();
    break
    case `text-${parentId}`:
      handler = {
        set: model.elementText = $(target).prop("checked")
      }
      slider.elementText.createElementText();
    break   
  }
}

//Создание панели управления
export class ControlPanel {
  name: string;
  parentElement: string;
  nameModel: Model;
  slider: Slider;
  constructor(_panel, _model, _slider) {
    this.name = _panel.namePanel;
    this.parentElement = _panel.panelParentElement;
    this.nameModel = _model;
    this.slider = _slider;
  }
  createControlPanel(slider: Slider) {
    const parentId =  $(this.parentElement).attr('id');
    for (let i = 0; i < 8; i++) {
      $(this.parentElement).append($('<div class="containerRow"></div>'));
    }
  
    $(this.parentElement).find(".containerRow:nth-child(1)").append($(`<label for='position-${parentId}'></label>`));
    $(this.parentElement).find(".containerRow:nth-child(1)").text('Position horizontal');
    let position:string; 
    if (this.nameModel.positionHorizontal) {
      position = 'checked';
    }
    $(this.parentElement).find(".containerRow:nth-child(1)").append($(`<input type=checkbox id='position-${parentId}' ${position}></input>`));

    $(this.parentElement).find(".containerRow:nth-child(2)").append($(`<label for="min-${parentId}"></label>`));
    $(this.parentElement).find(".containerRow:nth-child(2) label").text('Minimum value');
    $(this.parentElement).find(".containerRow:nth-child(2)").append($(`<input id="min-${parentId}" type=number value=${this.nameModel.minRange} min=0 max = ${this.nameModel.maxRange - 10}></input>`));

    $(this.parentElement).find(".containerRow:nth-child(3)").append($(`<label for="max-${parentId}"></label>`));
    $(this.parentElement).find(".containerRow:nth-child(3) label").text('Maximum value');
    $(this.parentElement).find(".containerRow:nth-child(3)").append($(`<input id="max-${parentId}" type=number value=${this.nameModel.maxRange} min=${this.nameModel.minRange + 10}></input>`));

    $(this.parentElement).find(".containerRow:nth-child(4)").append($(`<label for="thumb-${parentId}"></label>`));
    $(this.parentElement).find(".containerRow:nth-child(4) label").text('One thumb');
    let thumb:string; 
    if (this.nameModel.oneThumb) {
      thumb = 'checked';
    }
    $(this.parentElement).find(".containerRow:nth-child(4)").append($(`<input id="thumb-${parentId}" type=checkbox ${thumb}></input>`));

    $(this.parentElement).find(".containerRow:nth-child(5)").append($(`<label for="value-${parentId}"></label>`));
    $(this.parentElement).find(".containerRow:nth-child(5) label").text('Thumb value');
    $(this.parentElement).find(".containerRow:nth-child(5)").append($(`<input id="value-${parentId}" type=number value=${this.nameModel.value} min=${this.nameModel.minRange} max=${this.nameModel.maxRange}></input>`));

    $(this.parentElement).find(".containerRow:nth-child(6)").append($(`<label for="values1-${parentId}"></label>`));
    $(this.parentElement).find(".containerRow:nth-child(6) label").text('Thumbs values');
    $(this.parentElement).find(".containerRow:nth-child(6)").append($(`<input id="values1-${parentId}" type=number value=${this.nameModel.values[0]} min=${this.nameModel.minRange} max=${this.nameModel.maxRange}></input>`));
    $(this.parentElement).find(".containerRow:nth-child(6)").append($(`<input id="values2-${parentId}"type=number value=${this.nameModel.values[1]} min=${this.nameModel.minRange} max=${this.nameModel.maxRange}></input>`));

    $(this.parentElement).find(".containerRow:nth-child(7)").append($(`<label for="step-${parentId}"></label>`));
    $(this.parentElement).find(".containerRow:nth-child(7) label").text('Step');
    $(this.parentElement).find(".containerRow:nth-child(7)").append($(`<input id="step-${parentId}" type=number value=${this.nameModel.step} min=1></input>`));

    $(this.parentElement).find(".containerRow:nth-child(8)").append($(`<label for="text-${parentId}"></label>`));
    $(this.parentElement).find(".containerRow:nth-child(8) label").text('Value above the thumb');
    let element:string; 
    if (this.nameModel.elementText) {
      element = 'checked';
    }
    $(this.parentElement).find(".containerRow:nth-child(8)").append($(`<input id="text-${parentId}" type=checkbox ${element}></input>`));
    this.dataInput(slider);
  }

  dataInput(slider:Slider) {
    $("input").change(()=> {
      const parentId =  $(this.parentElement).attr('id');
      setParameter(this.nameModel, event.target, parentId, slider, $(this.parentElement).siblings());
    });
  }
}