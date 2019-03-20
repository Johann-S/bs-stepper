import { closest } from './polyfill'
import { Selectors, customProperty, show } from './util'

function clickStepLinearListener (event) {
  event.preventDefault()
}

function clickStepNonLinearListener (event) {
  event.preventDefault()

  const step = closest(event.target, Selectors.STEPS)
  const stepperNode = closest(step, Selectors.STEPPER)
  const stepper = stepperNode[customProperty]
  const stepIndex = stepper._steps.indexOf(step)

  stepper._currentIndex = stepIndex
  show(stepperNode, stepIndex)
}

export {
  clickStepLinearListener,
  clickStepNonLinearListener
}
