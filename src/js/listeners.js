import { closest } from './polyfill'
import { customProperty, show } from './util'

const buildClickStepLinearListener = () => function clickStepLinearListener (event) {
  event.preventDefault()
}

const buildClickStepNonLinearListener = options => function clickStepNonLinearListener (event) {
  event.preventDefault()

  const step = closest(event.target, options.selectors.steps)
  const stepperNode = closest(step, options.selectors.stepper)
  const stepper = stepperNode[customProperty]
  const stepIndex = stepper._steps.indexOf(step)

  show(stepperNode, stepIndex, options, () => {
    stepper._currentIndex = stepIndex
  })
}

export {
  buildClickStepLinearListener,
  buildClickStepNonLinearListener
}
