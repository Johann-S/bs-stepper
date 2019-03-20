import { WinEvent, createCustomEvent } from './polyfill'

const MILLISECONDS_MULTIPLIER = 1000
const Selectors = {
  STEPS: '.step',
  TRIGGER: '.step-trigger',
  STEPPER: '.bs-stepper'
}

const ClassName = {
  ACTIVE: 'active',
  LINEAR: 'linear',
  BLOCK: 'dstepper-block',
  NONE: 'dstepper-none',
  FADE: 'fade'
}

const transitionEndEvent = 'transitionend'
const customProperty = 'bsStepper'

const show = (stepperNode, indexStep) => {
  const stepper = stepperNode[customProperty]

  if (stepper._steps[indexStep].classList.contains(ClassName.ACTIVE) || stepper._stepsContents[indexStep].classList.contains(ClassName.ACTIVE)) {
    return
  }

  const showEvent = createCustomEvent('show.bs-stepper', {
    cancelable: true,
    detail: {
      indexStep
    }
  })
  stepperNode.dispatchEvent(showEvent)

  const activeStep = stepper._steps.filter(step => step.classList.contains(ClassName.ACTIVE))
  const activeContent = stepper._stepsContents.filter(content => content.classList.contains(ClassName.ACTIVE))

  if (showEvent.defaultPrevented) {
    return
  }

  if (activeStep.length) {
    activeStep[0].classList.remove(ClassName.ACTIVE)
  }
  if (activeContent.length) {
    activeContent[0].classList.remove(ClassName.ACTIVE)
    activeContent[0].classList.remove(ClassName.BLOCK)
  }

  showStep(stepperNode, stepper._steps[indexStep], stepper._steps)
  showContent(stepperNode, stepper._stepsContents[indexStep], stepper._stepsContents, activeContent)
}

const showStep = (stepperNode, step, stepList) => {
  stepList.forEach(step => {
    const trigger = step.querySelector(Selectors.TRIGGER)

    trigger.setAttribute('aria-selected', 'false')
    // if stepper is in linear mode, set disabled attribute on the trigger
    if (stepperNode.classList.contains(ClassName.LINEAR)) {
      trigger.setAttribute('disabled', 'disabled')
    }
  })

  step.classList.add(ClassName.ACTIVE)
  const currentTrigger = step.querySelector(Selectors.TRIGGER)

  currentTrigger.setAttribute('aria-selected', 'true')
  // if stepper is in linear mode, remove disabled attribute on current
  if (stepperNode.classList.contains(ClassName.LINEAR)) {
    currentTrigger.removeAttribute('disabled')
  }
}

const showContent = (stepperNode, content, contentList, activeContent) => {
  const shownEvent = createCustomEvent('shown.bs-stepper', {
    cancelable: true,
    detail: {
      indexStep: contentList.indexOf(content)
    }
  })

  function complete () {
    content.classList.add(ClassName.BLOCK)
    content.removeEventListener(transitionEndEvent, complete)
    stepperNode.dispatchEvent(shownEvent)
  }

  if (content.classList.contains(ClassName.FADE)) {
    content.classList.remove(ClassName.NONE)
    const duration = getTransitionDurationFromElement(content)

    content.addEventListener(transitionEndEvent, complete)
    if (activeContent.length) {
      activeContent[0].classList.add(ClassName.NONE)
    }

    content.classList.add(ClassName.ACTIVE)
    emulateTransitionEnd(content, duration)
  } else {
    content.classList.add(ClassName.ACTIVE)
    stepperNode.dispatchEvent(shownEvent)
  }
}

const getTransitionDurationFromElement = element => {
  if (!element) {
    return 0
  }

  // Get transition-duration of the element
  let transitionDuration = window.getComputedStyle(element).transitionDuration
  const floatTransitionDuration = parseFloat(transitionDuration)

  // Return 0 if element or transition duration is not found
  if (!floatTransitionDuration) {
    return 0
  }

  // If multiple durations are defined, take the first
  transitionDuration = transitionDuration.split(',')[0]

  return parseFloat(transitionDuration) * MILLISECONDS_MULTIPLIER
}

const emulateTransitionEnd = (element, duration) => {
  let called = false
  const durationPadding = 5
  const emulatedDuration = duration + durationPadding
  function listener () {
    called = true
    element.removeEventListener(transitionEndEvent, listener)
  }

  element.addEventListener(transitionEndEvent, listener)
  window.setTimeout(() => {
    if (!called) {
      element.dispatchEvent(WinEvent(transitionEndEvent))
    }

    element.removeEventListener(transitionEndEvent, listener)
  }, emulatedDuration)
}

const detectAnimation = (contentList, animation) => {
  if (animation) {
    contentList.forEach(content => {
      content.classList.add(ClassName.FADE)
      content.classList.add(ClassName.NONE)
    })
  }
}

export {
  show,
  Selectors,
  ClassName,
  customProperty,
  detectAnimation
}
