declare type StepperOptions = {
  linear?: boolean,
  animation?: boolean,
  selectors?: {
    steps?: string,
    trigger?: string,
    stepper?: string
  }
};

declare class Stepper {
  constructor(element: Element, _options?: StepperOptions);
  actualStep(): number;
  next(): void;
  previous(): void;
  to(stepNumber: number): void;
  reset(): void;
  destroy(): void;
}

export default Stepper;
