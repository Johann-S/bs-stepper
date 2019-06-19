import { show, customProperty, detectAnimation, ClassName } from './util'
import { buildClickStepLinearListener, buildClickStepNonLinearListener } from './listeners'

const DEFAULT_OPTIONS = {
  linear: true,
  animation: false,
  selectors: {
    steps: '.step',
    trigger: '.step-trigger',
    stepper: '.bs-stepper'
  }
}

class Stepper {
  constructor (element, _options = {}) {
    this._element = element
    this._currentIndex = 0
    this._stepsContents = []

    this.options = {
      ...DEFAULT_OPTIONS,
      ..._options
    }

    this.options.selectors = {
      ...DEFAULT_OPTIONS.selectors,
      ...this.options.selectors
    }

    if (this.options.linear) {
      this._element.classList.add(ClassName.LINEAR)
    }

    this._steps = [].slice.call(this._element.querySelectorAll(this.options.selectors.steps))

    this._steps.filter(step => step.hasAttribute('data-target'))
      .forEach(step => {
        this._stepsContents.push(
          this._element.querySelector(step.getAttribute('data-target'))
        )
      })

    detectAnimation(this._stepsContents, this.options)
    this._setLinkListeners()
    Object.defineProperty(this._element, customProperty, {
      value: this,
      writable: true
    })

    if (this._steps.length) {
      show(this._element, this._currentIndex, this.options, () => {})
    }
  }

  // Private

  _setLinkListeners () {
    this._steps.forEach(step => {
      const trigger = step.querySelector(this.options.selectors.trigger)

      if (this.options.linear) {
        this._clickStepLinearListener = buildClickStepLinearListener(this.options)
        trigger.addEventListener('click', this._clickStepLinearListener)
      } else {
        this._clickStepNonLinearListener = buildClickStepNonLinearListener(this.options)
        trigger.addEventListener('click', this._clickStepNonLinearListener)
      }
    })
  }

  // Public

  next () {
    const nextStep = (this._currentIndex + 1) <= this._steps.length - 1 ? this._currentIndex + 1 : (this._steps.length - 1)

    show(this._element, nextStep, this.options, () => {
      this._currentIndex = nextStep
    })
  }

  previous () {
    const previousStep = (this._currentIndex - 1) >= 0 ? this._currentIndex - 1 : 0

    show(this._element, previousStep, this.options, () => {
      this._currentIndex = previousStep
    })
  }

  to (stepNumber) {
    const tempIndex = stepNumber - 1
    const nextStep = tempIndex >= 0 && tempIndex < this._steps.length
      ? tempIndex
      : 0

    show(this._element, nextStep, this.options, () => {
      this._currentIndex = nextStep
    })
  }

  reset () {
    show(this._element, 0, this.options, () => {
      this._currentIndex = 0
    })
  }

  destroy () {
    this._steps.forEach(step => {
      const trigger = step.querySelector(this.options.selectors.trigger)

      if (this.options.linear) {
        trigger.removeEventListener('click', this._clickStepLinearListener)
      } else {
        trigger.removeEventListener('click', this._clickStepNonLinearListener)
      }
    })

    this._element[customProperty] = undefined
    this._element = undefined
    this._currentIndex = undefined
    this._steps = undefined
    this._stepsContents = undefined
    this._clickStepLinearListener = undefined
    this._clickStepNonLinearListener = undefined
  }
}

export default Stepper
