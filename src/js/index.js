const Selectors = {
  STEPS: '.step'
}

const ClassName = {
  ACTIVE: 'active'
}

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

class bsStepper {
  constructor(element) {
    this._element = element
    this._currentIndex = 0
    this._stepsContents = []
    this._steps = [].slice.call(this._element.querySelectorAll(Selectors.STEPS))
      .filter(step => step.hasAttribute('data-target'))

    this._steps.forEach(step => {
      this._stepsContents.push(
        document.querySelector(step.getAttribute('data-target'))
      )
    })

    if (this._steps.length) {
      showStep(this._steps[this._currentIndex], this._steps)
      showContent(this._stepsContents[this._currentIndex], this._stepsContents)
    }
  }

  next() {
    this._currentIndex = (this._currentIndex + 1) <= this._steps.length - 1 ? this._currentIndex + 1 : 0

    showStep(this._steps[this._currentIndex], this._steps)
    showContent(this._stepsContents[this._currentIndex], this._stepsContents)
  }

  destroy() {
    this._element = undefined
    this._currentIndex = undefined
    this._steps = undefined
    this._stepsContents = undefined
  }
}

export default bsStepper
