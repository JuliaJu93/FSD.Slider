import $ from 'jquery'

export class Model {
    constructor(name, sliderWidth, positionHorizontal, minRange, maxRange, oneThumb, values, value, step, elementText) {
      this.name = name;
      this.sliderWidth = sliderWidth;
      this.positionHorizontal = positionHorizontal;
      this.minRange = minRange;
      this.maxRange = maxRange;
      this.oneThumb = oneThumb;
      this.values = values;
      this.value = value;
      this.step = step;
      this.elementText = elementText;
    }
}

new Model ('model1', 400, true, 0, 200, false, [50, 180], 180, 10, true);

export let inputsValue = {
    sliderWidth: 400, // Ширина шкалы (пиксели)
    positionHorizontal: true, // Позиция шкалы (true - если горизонтальная, false - если вертикальная)
    minRange: 0, // Минимальное значение шкалы
    maxRange: 200, // Максимальное значение шкалы
    oneThumb: false, // Количество ручек (true - если ручка одна, false - если их несколько)
    values: [50, 180], // Интервал по умолчанию для шкалы с двумя ручками
    value: 180, // Значение по умолчанию для шкалы с одной ручкой
    step: 10, // Шаг движения ручки
    elementText: true, // Элемент над ручкой
};

export let i = {
    sliderWidth: 200, // Ширина шкалы (пиксели)
    positionHorizontal: false, // Позиция шкалы (true - если горизонтальная, false - если вертикальная)
    minRange: 20, // Минимальное значение шкалы
    maxRange: 100, // Максимальное значение шкалы
    oneThumb: true, // Количество ручек (true - если ручка одна, false - если их несколько)
    values: [34, 90], // Интервал по умолчанию для шкалы с двумя ручками
    value: 50, // Значение по умолчанию для шкалы с одной ручкой
    step: 1, // Шаг движения ручки
    elementText: true, // Элемент над ручкой
};