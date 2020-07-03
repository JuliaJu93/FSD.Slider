"use strict";
exports.__esModule = true;
exports.Model = void 0;
var Model = /** @class */ (function () {
    function Model(_model) {
        this.name = _model.name,
            this.sliderWidth = _model.sliderWidth,
            this.positionHorizontal = _model.positionHorizontal,
            this.minRange = _model.minRange,
            this.maxRange = _model.maxRange,
            this.oneThumb = _model.oneThumb,
            this.values = _model.values,
            this.value = _model.value,
            this.step = _model.step,
            this.elementText = _model.elementText;
    }
    ;
    return Model;
}());
exports.Model = Model;
