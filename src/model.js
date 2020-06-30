import $ from 'jquery'

export class Model {
  constructor(name, sliderWidth, positionHorizontal, minRange, maxRange, oneThumb, values, value, step, elementText) {
    this.name = name,
    this.sliderWidth = sliderWidth,
    this.positionHorizontal = positionHorizontal,
    this.minRange = minRange,
    this.maxRange = maxRange,
    this.oneThumb = oneThumb,
    this.values = values,
    this.value = value,
    this.step = step,
    this.elementText = elementText;
  };
}

