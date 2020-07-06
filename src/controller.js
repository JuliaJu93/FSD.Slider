"use strict";
exports.__esModule = true;
exports.ControlPanel = void 0;
var $ = require('jquery');
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
function setParameter(nameModel, target, parentId, slider, parentElement) {
    var handler = {};
    nameModel = new Proxy(nameModel, handler);
    switch (target.id) {
        case "position-" + parentId:
            handler = {
                set: nameModel.positionHorizontal = $(target).prop("checked")
            };
            slider.container.deleteContainer();
            slider.createSlider();
            break;
        case "min-" + parentId:
            handler = {
                set: nameModel.minRange = +target.value
            };
            if (nameModel.minRange < nameModel.maxRange) {
                //Проверки на изменения минимума
                if (nameModel.minRange > nameModel.value) {
                    nameModel.value = nameModel.minRange;
                }
                if (nameModel.minRange > nameModel.values[0]) {
                    nameModel.values[0] = nameModel.minRange;
                }
                slider.container.deleteContainer();
                slider.createSlider();
            }
            break;
        case "max-" + parentId:
            handler = {
                set: nameModel.maxRange = +target.value
            };
            if (nameModel.minRange < nameModel.maxRange) {
                //Проверки на изменения максимума
                if (nameModel.maxRange < nameModel.value) {
                    nameModel.value = nameModel.maxRange;
                }
                if (nameModel.maxRange < nameModel.values[1]) {
                    nameModel.values[1] = nameModel.maxRange;
                }
                console.log(nameModel.values[1]);
                slider.container.deleteContainer();
                slider.createSlider();
            }
            break;
        case "thumb-" + parentId:
            handler = {
                set: nameModel.oneThumb = $(target).prop("checked")
            };
            if (slider.nameModel.oneThumb) {
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
            break;
        case "values1-" + parentId:
            if ((+target.value <= slider.nameModel.maxRange) && (+target.value >= slider.nameModel.minRange) && (+target.value <= slider.nameModel.values[1])) {
                handler = {
                    set: nameModel.values[0] = +target.value
                };
            }
            else if (+target.value > slider.nameModel.maxRange) {
                handler = {
                    set: nameModel.values[0] = slider.nameModel.maxRange
                };
                $("#values1-" + parentId).val(slider.nameModel.maxRange);
            }
            else if (+target.value < slider.nameModel.minRange) {
                handler = {
                    set: nameModel.values[0] = slider.nameModel.minRange
                };
                $("#values1-" + parentId).val(slider.nameModel.minRange);
            }
            slider.singleThumb.defaultPosition();
            slider.elementText.changeValueElement(parentElement.find(".thumb:first-child")[0], false);
            break;
        case "values2-" + parentId:
            if ((+target.value <= slider.nameModel.maxRange) && (+target.value >= slider.nameModel.minRange) && (+target.value >= slider.nameModel.values[0])) {
                handler = {
                    set: nameModel.values[1] = +target.value
                };
            }
            else if (+target.value > slider.nameModel.maxRange) {
                handler = {
                    set: nameModel.values[1] = slider.nameModel.maxRange
                };
                $("#values2-" + parentId).val(slider.nameModel.maxRange);
            }
            else if (+target.value < slider.nameModel.minRange) {
                handler = {
                    set: nameModel.values[1] = slider.nameModel.minRange
                };
                $("#values2-" + parentId).val(slider.nameModel.minRange);
            }
            slider.singleThumb.defaultPosition();
            slider.elementText.changeValueElement(parentElement.find(".thumb:first-child")[1], false);
            break;
        case "value-" + parentId:
            if ((+target.value <= slider.nameModel.maxRange) && (+target.value >= slider.nameModel.minRange)) {
                handler = {
                    set: nameModel.value = +target.value
                };
            }
            else if (+target.value > slider.nameModel.maxRange) {
                handler = {
                    set: nameModel.value = slider.nameModel.maxRange
                };
                $("#value-" + parentId).val(slider.nameModel.maxRange);
            }
            else if (+target.value < slider.nameModel.minRange) {
                handler = {
                    set: nameModel.value = slider.nameModel.minRange
                };
                $("#value-" + parentId).val(slider.nameModel.minRange);
            }
            slider.singleThumb.defaultPosition();
            slider.elementText.changeValueElement(parentElement.find(".thumb:first-child")[1], false);
            break;
        case "step-" + parentId:
            handler = {
                set: nameModel.step = +target.value
            };
            slider.singleThumb.thumbMovement();
            break;
        case "text-" + parentId:
            handler = {
                set: nameModel.elementText = $(target).prop("checked")
            };
            slider.elementText.createElementText();
            break;
    }
}
//Создание панели управления
var ControlPanel = /** @class */ (function () {
    function ControlPanel(_name, _parentElement, _nameModel, _slider) {
        this.name = _name;
        this.parentElement = _parentElement;
        this.nameModel = _nameModel;
        this.slider = _slider;
    }
    ControlPanel.prototype.createControlPanel = function () {
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
        this.setValue(parentId);
        $(this.parentElement).find(".containerRow:nth-child(6)").append($("<label for=\"values1-" + parentId + "\"></label>"));
        $(this.parentElement).find(".containerRow:nth-child(6) label").text('Thumbs values');
        this.setValues(parentId);
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
        this.dataInput(this.slider);
    };
    ControlPanel.prototype.dataInput = function (slider) {
        var _this = this;
        $("input").change(function () {
            var parentId = $(_this.parentElement).attr('id');
            setParameter(_this.nameModel, event.target, parentId, _this.slider, $(_this.parentElement).siblings());
        });
    };
    ControlPanel.prototype.setValue = function (parentId) {
        $(this.parentElement).find(".containerRow:nth-child(5)").append($("<input id=\"value-" + parentId + "\" type=number value=" + this.nameModel.value + " min=" + this.nameModel.minRange + " max=" + this.nameModel.maxRange + "></input>"));
    };
    ControlPanel.prototype.setValues = function (parentId) {
        $(this.parentElement).find(".containerRow:nth-child(6)").append($("<input id=\"values1-" + parentId + "\" type=number value=" + this.nameModel.values[0] + " min=" + this.nameModel.minRange + " max=" + this.nameModel.maxRange + "></input>"));
        $(this.parentElement).find(".containerRow:nth-child(6)").append($("<input id=\"values2-" + parentId + "\"type=number value=" + this.nameModel.values[1] + " min=" + this.nameModel.minRange + " max=" + this.nameModel.maxRange + "></input>"));
    };
    return ControlPanel;
}());
exports.ControlPanel = ControlPanel;
