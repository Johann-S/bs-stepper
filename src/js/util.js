const Selectors = {
  STEPS: '.step',
  LINK: 'a',
  STEPPER: '.bs-stepper'
}

const ClassName = {
  ACTIVE: 'active',
  LINEAR: 'linear'
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

export {
  showContent,
  showStep,
  Selectors,
  ClassName,
  customProperty
}
