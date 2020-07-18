"use strict";
exports.__esModule = true;
exports.slider1 = exports.Slider = void 0;
var $ = require('jquery');
var model_js_1 = require("./model.js");
var controller_js_1 = require("./controller.js");
var Container = /** @class */ (function () {
    function Container(_name, _scale, _parentElement) {
        this.name = _name;
        this.parentElement = _parentElement;
        this.scale = _scale;
    }
    Container.prototype.createContainer = function () {
        $(this.parentElement).append($('<div class="containerOfSlider"></div>'));
        var position = this.scale.scalePosition();
        $(this.parentElement).find(".containerOfSlider").css('flex-direction', position.positionContent);
        return true;
    };
    Container.prototype.deleteContainer = function () {
        $(this.parentElement).find(".containerOfSlider").remove();
    };
    return Container;
}());
//Создание Шкалы произвольной ширины, с возможностью изменять ее позицию (горизонтальная или вертикальная)
var Scale = /** @class */ (function () {
    function Scale(_name, _parentElement, _nameModel) {
        this.name = _name;
        this.parentElement = _parentElement;
        this.nameModel = _nameModel;
    }
    Scale.prototype.createScale = function () {
        $(this.parentElement).find(".containerOfSlider").append($('<div class="scale"></div>'));
        var position = this.scalePosition();
        $(this.parentElement).find(".scale").css(position.size, this.nameModel.sliderWidth + 16);
    };
    //Пересчет значений в модели на пиксели;
    Scale.prototype.countToPixels = function () {
        var recalculation = [];
        var UnitRatio = this.nameModel.sliderWidth / (this.nameModel.maxRange - this.nameModel.minRange);
        if (this.nameModel.oneThumb) {
            recalculation[0] = (this.nameModel.value - this.nameModel.minRange) * UnitRatio;
        }
        else {
            recalculation[0] = (this.nameModel.values[0] - this.nameModel.minRange) * UnitRatio;
            recalculation[1] = (this.nameModel.values[1] - this.nameModel.minRange) * UnitRatio;
        }
        return recalculation;
    };
    // Параметры, которые зависят от положения шкалы
    Scale.prototype.scalePosition = function () {
        var direction, margin, size, intervalPosition, positionContent, reversePosition;
        if (this.nameModel.positionHorizontal) {
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
        return ({ direction: direction, margin: margin, size: size, positionContent: positionContent, reversePosition: reversePosition });
    };
    Scale.prototype.deleteScale = function () {
        $(this.parentElement).find(".scale").remove();
    };
    return Scale;
}());
// Шкала со значениями под ползунком
var ScaleOfValues = /** @class */ (function () {
    function ScaleOfValues(_name, _scale, _parentElement, _nameModel) {
        this.name = _name;
        this.parentElement = _parentElement;
        this.nameModel = _nameModel;
        this.scale = _scale;
    }
    ScaleOfValues.prototype.createScaleOfValues = function () {
        var position = this.scale.scalePosition();
        $(this.parentElement).find(".scale").after($('<div class="scaleOfValues"></div>'));
        $(this.parentElement).find(".scaleOfValues").css(position.size, this.nameModel.sliderWidth + 16 * 1.35);
        $(this.parentElement).find(".scaleOfValues").css('flex-direction', position.reversePosition);
        $(this.parentElement).find(".scaleOfValues").append($('<p></p>'));
        $(this.parentElement).find(".scaleOfValues").append($('<p></p>'));
        if (position.positionContent === 'row') {
            $(this.parentElement).find("p").css('margin', '0 1rem');
        }
        $(this.parentElement).find("p:first-child").text(this.nameModel.minRange);
        $(this.parentElement).find("p:last-child").text(this.nameModel.maxRange);
    };
    ScaleOfValues.prototype.deleteScaleOfValues = function () {
        $(this.parentElement).find(".scaleOfValues").remove();
    };
    return ScaleOfValues;
}());
//Значение над ручками
var ElementText = /** @class */ (function () {
    function ElementText(_name, _scale, _parentElement, _nameModel) {
        this.name = _name;
        this.parentElement = _parentElement;
        this.nameModel = _nameModel;
        this.scale = _scale;
    }
    ElementText.prototype.createElementText = function () {
        var elementFirst = $(this.parentElement).find(".thumb:first-child")[0];
        var elementSecond = $(this.parentElement).find(".thumb:last-child")[0];
        if (this.nameModel.elementText) {
            if (this.nameModel.oneThumb) {
                elementFirst.dataset.element = this.nameModel.value;
            }
            else {
                elementFirst.dataset.element = this.nameModel.values[0];
                elementSecond.dataset.element = this.nameModel.values[1];
            }
        }
        else {
            if (this.nameModel.oneThumb) {
                elementFirst.dataset.element = '';
            }
            else {
                elementFirst.dataset.element = '';
                elementSecond.dataset.element = '';
            }
        }
    };
    ElementText.prototype.changeValueElement = function (thumb, direction) {
        var value;
        if (this.nameModel.elementText && direction !== false) {
            if (this.nameModel.oneThumb) {
                value = +($(this.parentElement).find(".thumb:first-child")[0].dataset.element) + +this.nameModel.step * direction;
                $(this.parentElement).find(".thumb:first-child")[0].dataset.element = value;
            }
            else {
                if (thumb === $(this.parentElement).find(".thumb:first-child")[0]) {
                    if (this.nameModel.elementText) {
                        value = +($(this.parentElement).find(".thumb:first-child")[0].dataset.element) + +this.nameModel.step * direction;
                        $(this.parentElement).find(".thumb:first-child")[0].dataset.element = value;
                    }
                }
                else {
                    if (this.nameModel.elementText) {
                        value = +($(this.parentElement).find(".thumb:last-child")[0].dataset.element) + +this.nameModel.step * direction;
                        $(this.parentElement).find(".thumb:last-child")[0].dataset.element = value;
                    }
                }
            }
        }
        else {
            if (this.nameModel.oneThumb) {
                value = this.nameModel.value + +this.nameModel.step * direction;
                if (direction === false && this.nameModel.elementText) {
                    $(this.parentElement).find(".thumb:first-child")[0].dataset.element = this.nameModel.value;
                }
            }
            else {
                if (thumb === $(this.parentElement).find(".thumb:first-child")[0]) {
                    value = this.nameModel.values[0] + +this.nameModel.step * direction;
                    if (direction === false && this.nameModel.elementText) {
                        $(this.parentElement).find(".thumb:first-child")[0].dataset.element = this.nameModel.values[0];
                    }
                }
                else {
                    value = this.nameModel.values[1] + +this.nameModel.step * direction;
                    if (direction === false && this.nameModel.elementText) {
                        $(this.parentElement).find(".thumb:last-child")[0].dataset.element = this.nameModel.values[1];
                    }
                }
            }
        }
        //Публикация
        $(document).trigger("onclick", [value, thumb, this.nameModel, this.parentElement]);
    };
    return ElementText;
}());
// Ручки
var Thumb = /** @class */ (function () {
    function Thumb(_name, _scale, _interval, _elementText, _parentElement, _nameModel) {
        this.name = _name;
        this.parentElement = _parentElement;
        this.nameModel = _nameModel;
        this.scale = _scale;
        this.interval = _interval;
        this.elementText = _elementText;
    }
    Thumb.prototype.createThumb = function () {
        $(this.parentElement).find(".scale").append($('<span class="thumb"></span>'));
        if (this.nameModel.positionHorizontal) {
            $(this.parentElement).find(".thumb").css("bottom", ("-7px"));
        }
        else {
            $(this.parentElement).find(".thumb").css("left", ("-7px"));
        }
    };
    // Процесс перемещения ручек
    Thumb.prototype.thumbMovement = function () {
        var _this = this;
        $(this.parentElement).find(".thumb").mousedown(function () {
            var thumb = event.currentTarget;
            $(document).mousemove(function (event) {
                //В зависимости от горизонтального или вертикального положения шкалы выбираем траекторию движения ручки
                var direction, cursorPosition;
                if (_this.nameModel.positionHorizontal) {
                    direction = 'left';
                    cursorPosition = Math.round(event.pageX - $(_this.parentElement).find(".scale").offset()[direction]);
                }
                else {
                    direction = 'top';
                    cursorPosition = Math.round(event.pageY - $(_this.parentElement).find(".scale").offset()[direction]);
                }
                //Задаем ограничения по движению ручек
                var positionContainer = $(_this.parentElement).find(".scale").offset()[direction];
                var start, end;
                //Движение ручки по заданному шагу
                //количество шагов, вмещающихся в диапазон
                var recalculation = (_this.nameModel.maxRange - _this.nameModel.minRange) / _this.nameModel.step;
                //количество пикселей в одном шаге
                var step = Math.trunc(_this.nameModel.sliderWidth / recalculation);
                //Ограничения для движения слайдера с одной ручкой
                if (_this.nameModel.oneThumb) {
                    start = 0;
                    end = _this.nameModel.sliderWidth;
                }
                //Ограничения для движения слайдера с двумя ручками
                else if (thumb === $(_this.parentElement).find(".thumb:first-child")[0]) {
                    start = 0;
                    end = $(_this.parentElement).find(".thumb:last-child").offset()[direction] - positionContainer - 21;
                }
                else {
                    start = $(_this.parentElement).find(".thumb:first-child").offset()[direction] - positionContainer + 19;
                    end = _this.nameModel.sliderWidth + 1;
                }
                //Проверяем, чтобы ручки не выходили за заданные границы
                var coord = Number.parseInt(thumb.style[direction]);
                if (cursorPosition > coord + step) {
                    if (coord + step >= start && coord + step <= end) {
                        // Двигаем ручки вперед
                        thumb.style[direction] = coord + step + 'px';
                        _this.elementText.changeValueElement(thumb, 1);
                    }
                }
                else if (cursorPosition < coord - step) {
                    if (coord - step >= start && coord - step <= end) {
                        // Двигаем ручки назад
                        thumb.style[direction] = coord - step + 'px';
                        _this.elementText.changeValueElement(thumb, -1);
                    }
                }
                _this.interval.widthInterval();
            });
            $(document).mouseup(function () {
                $(document).off("mousemove");
            });
        });
    };
    //Позиция ручек по умолчанию
    Thumb.prototype.defaultPosition = function () {
        var recalculation = this.scale.countToPixels();
        var position = this.scale.scalePosition();
        if (this.nameModel.oneThumb) {
            $(this.parentElement).find(".thumb:first-child").css(position.direction, (recalculation + 'px'));
        }
        else {
            $(this.parentElement).find(".thumb:first-child").css(position.direction, (recalculation[0] + 'px'));
            $(this.parentElement).find(".thumb:last-child").css(position.direction, (recalculation[1] + 'px'));
        }
        this.interval.widthInterval();
    };
    Thumb.prototype.deleteThumb = function () {
        $(this.parentElement).find(".thumb").remove();
    };
    return Thumb;
}());
//Создание закрашенного интервала между двумя ручками интервального ползунка
var Interval = /** @class */ (function () {
    function Interval(_name, _scale, _parentElement, _nameModel) {
        this.name = _name;
        this.scale = _scale;
        this.parentElement = _parentElement;
        this.nameModel = _nameModel;
    }
    Interval.prototype.createInterval = function () {
        $(this.parentElement).find(".thumb:first-child").after($('<div class="interval"></div>'));
        var position = this.scale.scalePosition();
        var defaultPosition = this.scale.countToPixels();
        var width = defaultPosition[1] - defaultPosition[0];
        $(this.parentElement).find(".interval").css(position.size, (width + 'px'));
        $(this.parentElement).find(".interval").css(position.margin, (defaultPosition[0] + 'px'));
    };
    Interval.prototype.widthInterval = function () {
        var position = this.scale.scalePosition();
        var positionContainer = $(this.parentElement).find(".scale").offset()[position.direction];
        var thumbFirst = $(this.parentElement).find(".thumb:first-child").offset()[position.direction];
        var thumbSecond = $(this.parentElement).find(".thumb:last-child").offset()[position.direction];
        var width = thumbSecond - thumbFirst;
        $(this.parentElement).find(".interval").css(position.margin, (thumbFirst - positionContainer + 'px'));
        $(this.parentElement).find(".interval").css(position.size, (width + 'px'));
    };
    Interval.prototype.deleteInterval = function () {
        $(this.parentElement).find(".interval").remove();
    };
    return Interval;
}());
//Создание ползунка
var Slider = /** @class */ (function () {
    function Slider(_slider, _model, _panel) {
        this.nameSlider = _slider.nameSlider;
        this.parentElement = _slider.parentElement;
        this.nameModel = _slider.nameModel;
        this.model = new model_js_1.Model(_model);
        this.panel = new controller_js_1.ControlPanel(_panel, _model, _slider);
        this.scale = new Scale(_slider.nameScale, _slider.parentElement, this.model);
        this.container = new Container('container', this.scale, _slider.parentElement);
        this.interval = new Interval('interval', this.scale, _slider.parentElement, this.model);
        this.elementText = new ElementText('element', this.scale, _slider.parentElement, this.model);
        this.scaleOfValues = new ScaleOfValues(_slider.nameScale, this.scale, _slider.parentElement, this.model);
        this.singleThumb = new Thumb('thumbOne', this.scale, this.interval, this.elementText, _slider.parentElement, this.model);
        this.doubleThumb1 = new Thumb('thumbOne', this.scale, this.interval, this.elementText, _slider.parentElement, this.model);
        this.doubleThumb2 = new Thumb('thumbTwo', this.scale, this.interval, this.elementText, _slider.parentElement, this.model);
    }
    Slider.prototype.createSlider = function () {
        this.panel.createControlPanel();
        this.container.createContainer();
        this.scale.createScale();
        this.scaleOfValues.createScaleOfValues();
        if (this.model.oneThumb) {
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
    };
    return Slider;
}());
exports.Slider = Slider;
exports.slider1 = new Slider({ nameSlider: 'SliderOne', nameScale: 'Scale1', parentElement: ".container1" }, { nameModel: 'model1', sliderWidth: 300, positionHorizontal: true, minRange: 40, maxRange: 100, oneThumb: false, values: [50, 80], value: 80, step: 5, elementText: true }, { namePanel: 'panel1', panelParentElement: ".containerPanel1" });
exports.slider1.createSlider();
var slider2 = new Slider({ nameSlider: 'SliderTwo', nameScale: 'Scale2', parentElement: ".container2" }, { name: 'model2', sliderWidth: 200, positionHorizontal: false, minRange: 0, maxRange: 100, oneThumb: false, values: [40, 50], value: 60, step: 1, elementText: true }, { namePanel: 'panel2', panelParentElement: ".containerPanel2" });
slider2.createSlider();
var slider3 = new Slider({ nameSlider: 'SliderThree', nameScale: 'Scale3', parentElement: ".container3" }, { name: 'model3', sliderWidth: 400, positionHorizontal: true, minRange: 10, maxRange: 200, oneThumb: true, values: [50, 180], value: 80, step: 40, elementText: false }, { namePanel: 'panel3', panelParentElement: ".containerPanel3" });
slider3.createSlider();
