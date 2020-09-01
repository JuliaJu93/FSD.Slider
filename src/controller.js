"use strict";
exports.__esModule = true;
exports.slider1 = exports.model1 = exports.ControlPanel = exports.Slider = exports.setParameter = void 0;
var $ = require('jquery');
var model_js_1 = require("./model.js");
var view_js_1 = require("./view.js");
//Подписчик для View. Получает значение над ручкой ползунка и устанавливает его в панель управления
$(document).on("onclick", function (event, value, thumb, nameModel, parentElement) {
    var panel = $(parentElement).siblings()[0];
    var parentId = $(panel).attr('id');
    if (nameModel.oneThumb) {
        nameModel.value = value;
        $(panel).find("#value-" + parentId).val(value);
    }
    else {
        if (thumb === $(parentElement).find(".thumb:first-child")[0]) {
            nameModel.values[0] = value;
            $(panel).find("#values1-" + parentId).val(value);
        }
        else {
            nameModel.values[1] = value;
            $(panel).find("#values2-" + parentId).val(value);
        }
    }
});
// Пересохраняем данные в модели при вводе значений в панель управления и обновляем слайдер
function setParameter(model, target, parentId, slider, parentElement) {
    var handler = {};
    model = new Proxy(model, handler);
    switch (target.id) {
        case "position-" + parentId:
            handler = {
                set: model.positionHorizontal = $(target).prop("checked")
            };
            slider.container.deleteContainer();
            slider.createSlider();
            break;
        case "min-" + parentId:
            handler = {
                set: model.minRange = +target.value
            };
            if (model.minRange < model.maxRange) {
                //Проверки на изменения минимума
                if (model.minRange > model.value) {
                    model.value = model.minRange;
                    $("#value-" + parentId).val(model.minRange);
                }
                if (model.minRange > model.values[0]) {
                    model.values[0] = model.minRange;
                    $("#values1-" + parentId).val(model.minRange);
                }
                if (model.minRange > model.values[1]) {
                    model.values[1] = model.maxRange;
                    $("#values2-" + parentId).val(model.maxRange);
                }
                slider.container.deleteContainer();
                slider.createSlider();
            }
            else {
                handler = {
                    set: model.minRange = 0
                };
                $("#min-" + parentId).val(0);
                slider.container.deleteContainer();
                slider.createSlider();
            }
            break;
        case "max-" + parentId:
            handler = {
                set: model.maxRange = +target.value
            };
            if (model.minRange < model.maxRange) {
                //Проверки на изменения максимума
                if (model.maxRange < model.value) {
                    model.value = model.maxRange;
                    $("#value-" + parentId).val(model.maxRange);
                }
                if (model.maxRange < model.values[1]) {
                    model.values[1] = model.maxRange;
                    $("#values2-" + parentId).val(model.maxRange);
                }
                if (model.maxRange < model.values[0]) {
                    model.values[0] = model.minRange;
                    $("#values1-" + parentId).val(model.minRange);
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
                };
                if (model.maxRange > model.minRange) {
                    if (model.maxRange < model.value) {
                        model.value = model.maxRange;
                        $("#value-" + parentId).val(model.maxRange);
                    }
                    if (model.maxRange < model.values[1]) {
                        model.values[1] = model.maxRange;
                        $("#values2-" + parentId).val(model.maxRange);
                    }
                }
                $("#max-" + parentId).val(model.maxRange);
                slider.container.deleteContainer();
                slider.createSlider();
            }
            break;
        case "thumb-" + parentId:
            handler = {
                set: model.oneThumb = $(target).prop("checked")
            };
            if (slider.model.oneThumb) {
                slider.interval.deleteInterval();
                slider.singleThumb.deleteThumb();
                slider.singleThumb.createThumb(model);
            }
            else {
                slider.singleThumb.deleteThumb();
                slider.doubleThumb1.createThumb(model);
                slider.doubleThumb2.createThumb(model);
                slider.interval.createInterval(model);
            }
            slider.elementText.createElementText(model);
            slider.doubleThumb1.thumbMovement(model);
            slider.doubleThumb1.defaultPosition(model);
            break;
        case "values1-" + parentId:
            if ((+target.value <= model.maxRange) && (+target.value >= model.minRange) && (+target.value < model.values[1])) {
                handler = {
                    set: model.values[0] = +target.value
                };
            }
            else if (+target.value > model.maxRange) {
                handler = {
                    set: model.values[0] = model.maxRange
                };
                $("#values1-" + parentId).val(model.maxRange);
            }
            else if (+target.value < model.minRange) {
                handler = {
                    set: model.values[0] = model.minRange
                };
                $("#values1-" + parentId).val(model.minRange);
            }
            slider.singleThumb.defaultPosition(this.model.oneThumb);
            slider.elementText.changeValueElement(parentElement.find(".thumb:first-child")[0], false, model);
            break;
        case "values2-" + parentId:
            if ((+target.value <= model.maxRange) && (+target.value >= model.minRange) && (+target.value > model.values[0])) {
                handler = {
                    set: model.values[1] = +target.value
                };
            }
            else if (+target.value > model.maxRange) {
                handler = {
                    set: model.values[1] = model.maxRange
                };
                $("#values2-" + parentId).val(model.maxRange);
            }
            else if (+target.value < model.minRange) {
                handler = {
                    set: model.values[1] = model.minRange
                };
                $("#values2-" + parentId).val(model.minRange);
            }
            slider.singleThumb.defaultPosition(this.model.oneThumb);
            slider.elementText.changeValueElement(parentElement.find(".thumb:first-child")[1], false, model);
            break;
        case "value-" + parentId:
            if ((+target.value <= model.maxRange) && (+target.value >= model.minRange)) {
                handler = {
                    set: model.value = +target.value
                };
            }
            else if (+target.value > model.maxRange) {
                handler = {
                    set: model.value = model.maxRange
                };
                $("#value-" + parentId).val(model.maxRange);
            }
            else if (+target.value < model.minRange) {
                handler = {
                    set: model.value = model.minRange
                };
                $("#value-" + parentId).val(model.minRange);
            }
            slider.singleThumb.defaultPosition(this.model.oneThumb);
            slider.elementText.changeValueElement(parentElement.find(".thumb:first-child")[1], false, model);
            break;
        case "step-" + parentId:
            handler = {
                set: model.step = +target.value
            };
            slider.singleThumb.thumbMovement(model);
            break;
        case "text-" + parentId:
            handler = {
                set: model.elementText = $(target).prop("checked")
            };
            slider.elementText.createElementText(model);
            break;
    }
}
exports.setParameter = setParameter;
//Создание ползунка
var Slider = /** @class */ (function () {
    function Slider(_slider, _model, _panel) {
        this.model = _model;
        this.nameSlider = _slider.nameSlider;
        this.parentElement = _slider.parentElement;
        this.nameModel = _slider.nameModel;
        this.panel = new ControlPanel(_panel, _model, _slider);
        this.scale = new view_js_1.Scale(_slider.nameScale, _slider.parentElement);
        this.container = new view_js_1.Container('container', this.scale, _slider.parentElement);
        this.interval = new view_js_1.Interval('interval', this.scale, _slider.parentElement);
        this.elementText = new view_js_1.ElementText('element', this.scale, _slider.parentElement);
        this.scaleOfValues = new view_js_1.ScaleOfValues(_slider.nameScale, this.scale, _slider.parentElement);
        this.singleThumb = new view_js_1.Thumb('thumbOne', this.scale, this.interval, this.elementText, _slider.parentElement);
        this.doubleThumb1 = new view_js_1.Thumb('thumbOne', this.scale, this.interval, this.elementText, _slider.parentElement);
        this.doubleThumb2 = new view_js_1.Thumb('thumbTwo', this.scale, this.interval, this.elementText, _slider.parentElement);
    }
    Slider.prototype.createSlider = function () {
        this.container.createContainer(this.model);
        this.scale.createScale(this.model);
        this.scaleOfValues.createScaleOfValues(this.model);
        if (this.model.oneThumb) {
            this.singleThumb.createThumb(this.model);
        }
        else {
            this.doubleThumb1.createThumb(this.model);
            this.doubleThumb2.createThumb(this.model);
            this.interval.createInterval(this.model);
        }
        this.elementText.createElementText(this.model);
        this.doubleThumb1.thumbMovement(this.model);
        this.doubleThumb1.defaultPosition(this.model);
    };
    Slider.prototype.createControlPanel = function (slider) {
        this.panel.createControlPanel(slider);
    };
    return Slider;
}());
exports.Slider = Slider;
//Создание панели управления
var ControlPanel = /** @class */ (function () {
    function ControlPanel(_panel, _model, _slider) {
        this.name = _panel.namePanel;
        this.parentElement = _panel.panelParentElement;
        this.nameModel = _model;
        this.slider = _slider;
    }
    ControlPanel.prototype.createControlPanel = function (slider) {
        var parentId = $(this.parentElement).attr('id');
        for (var i = 0; i < 8; i++) {
            $(this.parentElement).append($('<div class="containerRow"></div>'));
        }
        $(this.parentElement).find(".containerRow:nth-child(1)").append($("<label for='position-" + parentId + "'></label>"));
        $(this.parentElement).find(".containerRow:nth-child(1)").text('Position horizontal');
        var position;
        if (this.nameModel.positionHorizontal) {
            position = 'checked';
        }
        $(this.parentElement).find(".containerRow:nth-child(1)").append($("<input type=checkbox id='position-" + parentId + "' " + position + "></input>"));
        $(this.parentElement).find(".containerRow:nth-child(2)").append($("<label for=\"min-" + parentId + "\"></label>"));
        $(this.parentElement).find(".containerRow:nth-child(2) label").text('Minimum value');
        $(this.parentElement).find(".containerRow:nth-child(2)").append($("<input id=\"min-" + parentId + "\" type=number value=" + this.nameModel.minRange + " min=0 max = " + (this.nameModel.maxRange - 10) + "></input>"));
        $(this.parentElement).find(".containerRow:nth-child(3)").append($("<label for=\"max-" + parentId + "\"></label>"));
        $(this.parentElement).find(".containerRow:nth-child(3) label").text('Maximum value');
        $(this.parentElement).find(".containerRow:nth-child(3)").append($("<input id=\"max-" + parentId + "\" type=number value=" + this.nameModel.maxRange + " min=" + (this.nameModel.minRange + 10) + "></input>"));
        $(this.parentElement).find(".containerRow:nth-child(4)").append($("<label for=\"thumb-" + parentId + "\"></label>"));
        $(this.parentElement).find(".containerRow:nth-child(4) label").text('One thumb');
        var thumb;
        if (this.nameModel.oneThumb) {
            thumb = 'checked';
        }
        $(this.parentElement).find(".containerRow:nth-child(4)").append($("<input id=\"thumb-" + parentId + "\" type=checkbox " + thumb + "></input>"));
        $(this.parentElement).find(".containerRow:nth-child(5)").append($("<label for=\"value-" + parentId + "\"></label>"));
        $(this.parentElement).find(".containerRow:nth-child(5) label").text('Thumb value');
        $(this.parentElement).find(".containerRow:nth-child(5)").append($("<input id=\"value-" + parentId + "\" type=number value=" + this.nameModel.value + " min=" + this.nameModel.minRange + " max=" + this.nameModel.maxRange + "></input>"));
        $(this.parentElement).find(".containerRow:nth-child(6)").append($("<label for=\"values1-" + parentId + "\"></label>"));
        $(this.parentElement).find(".containerRow:nth-child(6) label").text('Thumbs values');
        $(this.parentElement).find(".containerRow:nth-child(6)").append($("<input id=\"values1-" + parentId + "\" type=number value=" + this.nameModel.values[0] + " min=" + this.nameModel.minRange + " max=" + this.nameModel.maxRange + "></input>"));
        $(this.parentElement).find(".containerRow:nth-child(6)").append($("<input id=\"values2-" + parentId + "\"type=number value=" + this.nameModel.values[1] + " min=" + this.nameModel.minRange + " max=" + this.nameModel.maxRange + "></input>"));
        $(this.parentElement).find(".containerRow:nth-child(7)").append($("<label for=\"step-" + parentId + "\"></label>"));
        $(this.parentElement).find(".containerRow:nth-child(7) label").text('Step');
        $(this.parentElement).find(".containerRow:nth-child(7)").append($("<input id=\"step-" + parentId + "\" type=number value=" + this.nameModel.step + " min=1></input>"));
        $(this.parentElement).find(".containerRow:nth-child(8)").append($("<label for=\"text-" + parentId + "\"></label>"));
        $(this.parentElement).find(".containerRow:nth-child(8) label").text('Value above the thumb');
        var element;
        if (this.nameModel.elementText) {
            element = 'checked';
        }
        $(this.parentElement).find(".containerRow:nth-child(8)").append($("<input id=\"text-" + parentId + "\" type=checkbox " + element + "></input>"));
        this.dataInput(slider);
    };
    ControlPanel.prototype.dataInput = function (slider) {
        var _this = this;
        $("input").change(function () {
            var parentId = $(_this.parentElement).attr('id');
            setParameter(_this.nameModel, event.target, parentId, slider, $(_this.parentElement).siblings());
        });
    };
    return ControlPanel;
}());
exports.ControlPanel = ControlPanel;
exports.model1 = new model_js_1.Model({ nameModel: 'model1', sliderWidth: 300, positionHorizontal: true, minRange: 40, maxRange: 100, oneThumb: false, values: [50, 80], value: 80, step: 5, elementText: true });
exports.slider1 = new Slider({ nameSlider: 'SliderOne', nameScale: 'Scale1', parentElement: ".container1" }, exports.model1, { namePanel: 'panel1', panelParentElement: ".containerPanel1" });
exports.slider1.createSlider();
exports.slider1.createControlPanel(exports.slider1);
var model2 = new model_js_1.Model({ nameModel: 'model2', sliderWidth: 200, positionHorizontal: false, minRange: 0, maxRange: 100, oneThumb: false, values: [40, 50], value: 60, step: 1, elementText: true });
var slider2 = new Slider({ nameSlider: 'SliderTwo', nameScale: 'Scale2', parentElement: ".container2" }, model2, { namePanel: 'panel2', panelParentElement: ".containerPanel2" });
slider2.createSlider();
slider2.createControlPanel(slider2);
var model3 = new model_js_1.Model({ nameModel: 'model3', sliderWidth: 400, positionHorizontal: true, minRange: 10, maxRange: 200, oneThumb: true, values: [50, 180], value: 80, step: 40, elementText: false });
var slider3 = new Slider({ nameSlider: 'SliderThree', nameScale: 'Scale3', parentElement: ".container3" }, model3, { namePanel: 'panel3', panelParentElement: ".containerPanel3" });
slider3.createSlider();
slider3.createControlPanel(slider3);
