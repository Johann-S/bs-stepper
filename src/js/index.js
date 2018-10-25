import { showContent, showStep, Selectors, ClassName, customProperty, detectAnimation } from './util'
import { clickStepLinearListener, clickStepNonLinearListener } from './listeners'

const DEFAULT_OPTIONS = {
  linear: true,
  animation: false
}

class Stepper {
  constructor (element, _options = {}) {
    this._element = element
    this._currentIndex = 0
    this._stepsContents = []
    this._steps = [].slice.call(this._element.querySelectorAll(Selectors.STEPS))
      .filter(step => step.hasAttribute('data-target'))

    this._steps.forEach(step => {
      this._stepsContents.push(
        this._element.querySelector(step.getAttribute('data-target'))
      )
    })

    this.options = {
      ...DEFAULT_OPTIONS,
      ..._options
    }

    if (this.options.linear) {
      this._element.classList.add(ClassName.LINEAR)
    }

    detectAnimation(this._stepsContents, this.options.animation)
    if (this._steps.length) {
      showStep(this._steps[this._currentIndex], this._steps)
      showContent(this._stepsContents[this._currentIndex], this._stepsContents)
    }

    this._setLinkListeners()
    Object.defineProperty(this._element, customProperty, {
      value: this,
      writable: true
    })
  }

  // Private

  _setLinkListeners () {
    this._steps.forEach(step => {
      const trigger = step.querySelector(Selectors.TRIGGER)
      if (this.options.linear) {
        trigger.addEventListener('click', clickStepLinearListener)
      } else {
        trigger.addEventListener('click', clickStepNonLinearListener)
      }
    })
  }

  // Public

  next () {
    this._currentIndex = (this._currentIndex + 1) <= this._steps.length - 1 ? this._currentIndex + 1 : (this._steps.length - 1)

    showStep(this._steps[this._currentIndex], this._steps)
    showContent(this._stepsContents[this._currentIndex], this._stepsContents)
  }

  previous () {
    this._currentIndex = (this._currentIndex - 1) >= 0 ? this._currentIndex - 1 : 0

    showStep(this._steps[this._currentIndex], this._steps)
    showContent(this._stepsContents[this._currentIndex], this._stepsContents)
  }

  reset () {
    this._currentIndex = 0
    showStep(this._steps[this._currentIndex], this._steps)
    showContent(this._stepsContents[this._currentIndex], this._stepsContents)
  }

  destroy () {
    this._steps.forEach(step => {
      const trigger = step.querySelector(Selectors.TRIGGER)
      if (this.options.linear) {
        trigger.removeEventListener('click', clickStepLinearListener)
      } else {
        trigger.removeEventListener('click', clickStepNonLinearListener)
      }
    })

    this._element[customProperty] = undefined
    this._element = undefined
    this._currentIndex = undefined
    this._steps = undefined
    this._stepsContents = undefined
  }
}

export default Stepper
