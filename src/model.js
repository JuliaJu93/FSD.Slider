import $ from 'jquery'

export class Model {
  constructor(model) {
    this.name = model.name,
    this.sliderWidth = model.sliderWidth,
    this.positionHorizontal = model.positionHorizontal,
    this.minRange = model.minRange,
    this.maxRange = model.maxRange,
    this.oneThumb = model.oneThumb,
    this.values = model.values,
    this.value = model.value,
    this.step = model.step,
    this.elementText = model.elementText;
  };
}

