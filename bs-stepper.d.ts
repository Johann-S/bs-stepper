declare type StepperOptions = {
  linear: boolean,
  animation: boolean,
  selectors: {
    steps: string,
    trigger: string,
    stepper: string
  },
  classNames: {
    active: string,
    linear: string,
    block: string,
    none: string,
    fade: string
  }
};

declare class Stepper {
  constructor(element: Element, _options?: StepperOptions);
  next(): void;
  previous(): void;
  to(stepNumber: number): void;
  reset(): void;
  destroy(): void;
}

export default Stepper;
