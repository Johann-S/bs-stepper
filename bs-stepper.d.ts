declare type bsStepperOptions = {
  linear: boolean,
};

declare class Stepper {
  constructor(element: Element, _options: bsStepperOptions);
  next(): void;
  previous(): void;
  destroy(): void;
}

export default Stepper;
