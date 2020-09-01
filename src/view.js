"use strict";
exports.__esModule = true;
exports.Interval = exports.Thumb = exports.ElementText = exports.ScaleOfValues = exports.Scale = exports.Container = void 0;
var $ = require('jquery');
var Container = /** @class */ (function () {
    function Container(_name, _scale, _parentElement) {
        this.name = _name;
        this.parentElement = _parentElement;
        this.scale = _scale;
    }
    Container.prototype.createContainer = function (model) {
        $(this.parentElement).append($('<div class="containerOfSlider"></div>'));
        var position = this.scale.scalePosition(model);
        $(this.parentElement).find(".containerOfSlider").css('flex-direction', position.positionContent);
    };
    Container.prototype.deleteContainer = function () {
        $(this.parentElement).find(".containerOfSlider").remove();
    };
    return Container;
}());
exports.Container = Container;
//Создание Шкалы произвольной ширины, с возможностью изменять ее позицию (горизонтальная или вертикальная)
var Scale = /** @class */ (function () {
    function Scale(_name, _parentElement) {
        this.name = _name;
        this.parentElement = _parentElement;
    }
    Scale.prototype.createScale = function (model) {
        $(this.parentElement).find(".containerOfSlider").append($('<div class="scale"></div>'));
        var position = this.scalePosition(model);
        $(this.parentElement).find(".scale").css(position.size, model.sliderWidth + 16);
    };
    //Пересчет значений в модели на пиксели;
    Scale.prototype.countToPixels = function (model) {
        var recalculation = [];
        var UnitRatio = model.sliderWidth / (model.maxRange - model.minRange);
        if (model.oneThumb) {
            recalculation[0] = (model.value - model.minRange) * UnitRatio;
        }
        else {
            recalculation[0] = (model.values[0] - model.minRange) * UnitRatio;
            recalculation[1] = (model.values[1] - model.minRange) * UnitRatio;
        }
        return recalculation;
    };
    // Параметры, которые зависят от положения шкалы
    Scale.prototype.scalePosition = function (model) {
        var direction, margin, size, intervalPosition, positionContent, reversePosition;
        if (model.positionHorizontal) {
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
exports.Scale = Scale;
// Шкала со значениями под ползунком
var ScaleOfValues = /** @class */ (function () {
    function ScaleOfValues(_name, _scale, _parentElement) {
        this.name = _name;
        this.parentElement = _parentElement;
        this.scale = _scale;
    }
    ScaleOfValues.prototype.createScaleOfValues = function (model) {
        var position = this.scale.scalePosition(model);
        $(this.parentElement).find(".scale").after($('<div class="scaleOfValues"></div>'));
        $(this.parentElement).find(".scaleOfValues").css(position.size, model.sliderWidth + 16 * 1.35);
        $(this.parentElement).find(".scaleOfValues").css('flex-direction', position.reversePosition);
        $(this.parentElement).find(".scaleOfValues").append($('<p></p>'));
        $(this.parentElement).find(".scaleOfValues").append($('<p></p>'));
        if (position.positionContent === 'row') {
            $(this.parentElement).find("p").css('margin', '0 1rem');
        }
        $(this.parentElement).find("p:first-child").text(model.minRange);
        $(this.parentElement).find("p:last-child").text(model.maxRange);
    };
    ScaleOfValues.prototype.deleteScaleOfValues = function () {
        $(this.parentElement).find(".scaleOfValues").remove();
    };
    return ScaleOfValues;
}());
exports.ScaleOfValues = ScaleOfValues;
//Значение над ручками
var ElementText = /** @class */ (function () {
    function ElementText(_name, _scale, _parentElement) {
        this.name = _name;
        this.parentElement = _parentElement;
        this.scale = _scale;
    }
    ElementText.prototype.createElementText = function (model) {
        var elementFirst = $(this.parentElement).find(".thumb:first-child")[0];
        var elementSecond = $(this.parentElement).find(".thumb:last-child")[0];
        if (model.elementText) {
            if (model.oneThumb) {
                elementFirst.dataset.element = model.value;
            }
            else {
                elementFirst.dataset.element = model.values[0];
                elementSecond.dataset.element = model.values[1];
            }
        }
        else {
            if (model.oneThumb) {
                elementFirst.dataset.element = '';
            }
            else {
                elementFirst.dataset.element = '';
                elementSecond.dataset.element = '';
            }
        }
    };
    ElementText.prototype.changeValueElement = function (thumb, direction, model) {
        var value;
        if (model.elementText && direction !== false) {
            if (model.oneThumb) {
                value = +($(this.parentElement).find(".thumb:first-child")[0].dataset.element) + +model.step * direction;
                $(this.parentElement).find(".thumb:first-child")[0].dataset.element = value;
            }
            else {
                if (thumb === $(this.parentElement).find(".thumb:first-child")[0]) {
                    if (model.elementText) {
                        value = +($(this.parentElement).find(".thumb:first-child")[0].dataset.element) + +model.step * direction;
                        $(this.parentElement).find(".thumb:first-child")[0].dataset.element = value;
                    }
                }
                else {
                    if (model.elementText) {
                        value = +($(this.parentElement).find(".thumb:last-child")[0].dataset.element) + +model.step * direction;
                        $(this.parentElement).find(".thumb:last-child")[0].dataset.element = value;
                    }
                }
            }
        }
        else {
            if (model.oneThumb) {
                value = model.value + +model.step * direction;
                if (direction === false && model.elementText) {
                    $(this.parentElement).find(".thumb:first-child")[0].dataset.element = model.value;
                }
            }
            else {
                if (thumb === $(this.parentElement).find(".thumb:first-child")[0]) {
                    value = model.values[0] + +model.step * direction;
                    if (direction === false && model.elementText) {
                        $(this.parentElement).find(".thumb:first-child")[0].dataset.element = model.values[0];
                    }
                }
                else {
                    value = model.values[1] + +model.step * direction;
                    if (direction === false && model.elementText) {
                        $(this.parentElement).find(".thumb:last-child")[0].dataset.element = model.values[1];
                    }
                }
            }
        }
        //Публикация
        $(document).trigger("onclick", [value, thumb, model, this.parentElement]);
    };
    return ElementText;
}());
exports.ElementText = ElementText;
// Ручки
var Thumb = /** @class */ (function () {
    function Thumb(_name, _scale, _interval, _elementText, _parentElement) {
        this.name = _name;
        this.parentElement = _parentElement;
        this.scale = _scale;
        this.interval = _interval;
        this.elementText = _elementText;
    }
    Thumb.prototype.createThumb = function (model) {
        $(this.parentElement).find(".scale").append($('<span class="thumb"></span>'));
        if (model.positionHorizontal) {
            $(this.parentElement).find(".thumb").css("bottom", ("-7px"));
        }
        else {
            $(this.parentElement).find(".thumb").css("left", ("-7px"));
        }
    };
    // Процесс перемещения ручек
    Thumb.prototype.thumbMovement = function (model) {
        var _this = this;
        $(this.parentElement).find(".thumb").mousedown(function () {
            var thumb = event.currentTarget;
            $(document).mousemove(function (event) {
                //В зависимости от горизонтального или вертикального положения шкалы выбираем траекторию движения ручки
                var direction, cursorPosition;
                if (model.positionHorizontal) {
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
                var recalculation = (model.maxRange - model.minRange) / model.step;
                //количество пикселей в одном шаге
                var step = Math.trunc(model.sliderWidth / recalculation);
                //Ограничения для движения слайдера с одной ручкой
                if (model.oneThumb) {
                    start = 0;
                    end = model.sliderWidth;
                }
                //Ограничения для движения слайдера с двумя ручками
                else if (thumb === $(_this.parentElement).find(".thumb:first-child")[0]) {
                    start = 0;
                    end = $(_this.parentElement).find(".thumb:last-child").offset()[direction] - positionContainer - 21;
                }
                else {
                    start = $(_this.parentElement).find(".thumb:first-child").offset()[direction] - positionContainer + 19;
                    end = model.sliderWidth + 1;
                }
                //Проверяем, чтобы ручки не выходили за заданные границы
                var coord = Number.parseInt(thumb.style[direction]);
                if (cursorPosition > coord + step) {
                    if (coord + step >= start && coord + step <= end) {
                        // Двигаем ручки вперед
                        thumb.style[direction] = coord + step + 'px';
                        _this.elementText.changeValueElement(thumb, 1, model);
                    }
                }
                else if (cursorPosition < coord - step) {
                    if (coord - step >= start && coord - step <= end) {
                        // Двигаем ручки назад
                        thumb.style[direction] = coord - step + 'px';
                        _this.elementText.changeValueElement(thumb, -1, model);
                    }
                }
                _this.interval.widthInterval(model);
            });
            $(document).mouseup(function () {
                $(document).off("mousemove");
            });
        });
    };
    //Позиция ручек по умолчанию
    Thumb.prototype.defaultPosition = function (model) {
        var recalculation = this.scale.countToPixels(model);
        var position = this.scale.scalePosition(model);
        if (model.oneThumb) {
            $(this.parentElement).find(".thumb:first-child").css(position.direction, (recalculation + 'px'));
        }
        else {
            $(this.parentElement).find(".thumb:first-child").css(position.direction, (recalculation[0] + 'px'));
            $(this.parentElement).find(".thumb:last-child").css(position.direction, (recalculation[1] + 'px'));
        }
        this.interval.widthInterval(model);
    };
    Thumb.prototype.deleteThumb = function () {
        $(this.parentElement).find(".thumb").remove();
    };
    return Thumb;
}());
exports.Thumb = Thumb;
//Создание закрашенного интервала между двумя ручками интервального ползунка
var Interval = /** @class */ (function () {
    function Interval(_name, _scale, _parentElement) {
        this.name = _name;
        this.scale = _scale;
        this.parentElement = _parentElement;
    }
    Interval.prototype.createInterval = function (model) {
        $(this.parentElement).find(".thumb:first-child").after($('<div class="interval"></div>'));
        var position = this.scale.scalePosition(model);
        var defaultPosition = this.scale.countToPixels(model);
        var width = defaultPosition[1] - defaultPosition[0];
        $(this.parentElement).find(".interval").css(position.size, (width + 'px'));
        $(this.parentElement).find(".interval").css(position.margin, (defaultPosition[0] + 'px'));
    };
    Interval.prototype.widthInterval = function (model) {
        var position = this.scale.scalePosition(model);
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
exports.Interval = Interval;
