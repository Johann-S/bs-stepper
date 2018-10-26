import { closest } from './polyfill'
import { Selectors, customProperty, showStep, showContent } from './util'

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
  showStep(step, stepper._steps)
  showContent(stepper._stepsContents[stepIndex], stepper._stepsContents)
}

export {
  clickStepLinearListener,
  clickStepNonLinearListener
}
