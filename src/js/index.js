import { show, customProperty, detectAnimation } from './util'
import { buildClickStepLinearListener, buildClickStepNonLinearListener } from './listeners'

const DEFAULT_OPTIONS = {
  linear: true,
  animation: false,
  selectors: {
    steps: '.step',
    trigger: '.step-trigger',
    stepper: '.bs-stepper'
  },
  classNames: {
    active: 'active',
    linear: 'linear',
    block: 'dstepper-block',
    none: 'dstepper-none',
    fade: 'fade'
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

    if (this.options.linear) {
      this._element.classList.add(this.options.classNames.linear)
    }

    this._steps = [].slice.call(this._element.querySelectorAll(this.options.selectors.steps))
      .filter(step => step.hasAttribute('data-target'))

    this._steps.forEach(step => {
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
      show(this._element, this._currentIndex, this.options)
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
    this._currentIndex = (this._currentIndex + 1) <= this._steps.length - 1 ? this._currentIndex + 1 : (this._steps.length - 1)

    show(this._element, this._currentIndex, this.options)
  }

  previous () {
    this._currentIndex = (this._currentIndex - 1) >= 0 ? this._currentIndex - 1 : 0

    show(this._element, this._currentIndex, this.options)
  }

  to (stepNumber) {
    const tempIndex = stepNumber - 1

    this._currentIndex = tempIndex >= 0 && tempIndex < this._steps.length
      ? tempIndex
      : 0

    show(this._element, this._currentIndex, this.options)
  }

  reset () {
    this._currentIndex = 0
    show(this._element, this._currentIndex, this.options)
  }

  destroy () {
    this._steps.forEach(step => {
      const trigger = step.querySelector(this.options.selectors.trigger)

      if (this.options.linear) {
        if (this._clickStepLinearListener) {
          trigger.removeEventListener('click', this._clickStepLinearListener)
        }
      } else {
        if (this._clickStepNonLinearListener) {
          trigger.removeEventListener('click', this._clickStepNonLinearListener)
        }
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
