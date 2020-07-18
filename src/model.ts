export class Model {
  nameModel:string;
  sliderWidth:number;
  positionHorizontal:boolean;
  minRange:number;
  maxRange:number;
  oneThumb:boolean;
  values:Array<number>;
  value:number;
  step:number;
  elementText:boolean;
  constructor(_model:Model) {
    this.nameModel = _model.nameModel,
    this.sliderWidth = _model.sliderWidth,
    this.positionHorizontal = _model.positionHorizontal,
    this.minRange = _model.minRange,
    this.maxRange = _model.maxRange,
    this.oneThumb = _model.oneThumb,
    this.values = _model.values,
    this.value = _model.value,
    this.step = _model.step,
    this.elementText = _model.elementText;
  };
}
