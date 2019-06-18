import { closest } from './polyfill'
import { customProperty, show } from './util'

const buildClickStepLinearListener = (options) => {
  return function clickStepLinearListener (event) {
    event.preventDefault()
  }
}

const buildClickStepNonLinearListener = (options) => {
  return function clickStepNonLinearListener (event) {
    event.preventDefault()

    const step = closest(event.target, options.selectors.steps)
    const stepperNode = closest(step, options.selectors.stepper)
    const stepper = stepperNode[customProperty]
    const stepIndex = stepper._steps.indexOf(step)

    stepper._currentIndex = stepIndex
    show(stepperNode, stepIndex, options)
  }
}

export {
  buildClickStepLinearListener,
  buildClickStepNonLinearListener
}
