import { closest } from './polyfill'

const Selectors = {
  STEPS: '.step',
  LINK: 'a',
  STEPPER: '.bs-stepper'
}

const ClassName = {
  ACTIVE: 'active'
}

const DEFAULT_OPTIONS = {
  linear: true
}

const customProperty = 'bsStepper'

const showStep = (step, stepList) => {
  if (step.classList.contains(ClassName.ACTIVE)) {
    return
  }

  const activeStep = stepList.filter(step => step.classList.contains(ClassName.ACTIVE))
  if (activeStep.length) {
    activeStep[0].classList.remove(ClassName.ACTIVE)
  }

  step.classList.add(ClassName.ACTIVE)
}

const showContent = (content, contentList) => {
  if (content.classList.contains(ClassName.ACTIVE)) {
    return
  }

  const activeContent = contentList.filter(content => content.classList.contains(ClassName.ACTIVE))
  if (activeContent.length) {
    activeContent[0].classList.remove(ClassName.ACTIVE)
  }

  content.classList.add(ClassName.ACTIVE)
}

function clickStepListener (event) {
  event.preventDefault()

  const step = closest(event.target, Selectors.STEPS)
  if (step) {
    const stepperNode = closest(step, Selectors.STEPPER)
    const stepper = stepperNode[customProperty]

    const stepIndex = stepper._steps.indexOf(step)
    showStep(step, stepper._steps)
    showContent(stepper._stepsContents[stepIndex], stepper._stepsContents)
  }
}

class bsStepper {
  constructor (element, _options) {
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
    if (!this.options.linear) {
      this._steps.forEach(step => {
        step.querySelector(Selectors.LINK)
          .addEventListener('click', clickStepListener)
      })
    }
  }

  // Public

  next () {
    this._currentIndex = (this._currentIndex + 1) <= this._steps.length - 1 ? this._currentIndex + 1 : 0

    showStep(this._steps[this._currentIndex], this._steps)
    showContent(this._stepsContents[this._currentIndex], this._stepsContents)
  }

  destroy () {
    if (!this.options.linear) {
      this._steps.forEach(step => {
        const link = step.querySelector(Selectors.LINK)
        link.removeEventListener('click', clickStepListener)
      })
    }

    delete this._element[customProperty]
    this._element = undefined
    this._currentIndex = undefined
    this._steps = undefined
    this._stepsContents = undefined
  }
}

export default bsStepper
