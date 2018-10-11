declare type bsStepperOptions = {
  linear: boolean,
};

declare class bsStepper {
  constructor(element: Element, _options: bsStepperOptions);
  next(): void;
  destroy(): void;
}

export default bsStepper;
