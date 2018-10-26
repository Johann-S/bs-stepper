import { WinEvent, closest } from './polyfill'

const MILLISECONDS_MULTIPLIER = 1000
const Selectors = {
  STEPS: '.step',
  TRIGGER: '.step-trigger, a',
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

const showStep = (step, stepList) => {
  if (step.classList.contains(ClassName.ACTIVE)) {
    return
  }

  const stepperNode = closest(step, Selectors.STEPPER)
  const activeStep = stepList.filter(step => step.classList.contains(ClassName.ACTIVE))
  if (activeStep.length) {
    activeStep[0].classList.remove(ClassName.ACTIVE)
  }
  stepList.forEach(step => {
    const trigger = step.querySelector(Selectors.TRIGGER)
    trigger.removeAttribute('aria-current')
    // if stepper is in linear mode, set disabled attribute on the trigger
    if (stepperNode.classList.contains(ClassName.LINEAR)) {
      trigger.setAttribute('disabled', 'disabled')
    }
  })

  step.classList.add(ClassName.ACTIVE)
  const currentTrigger = step.querySelector(Selectors.TRIGGER)
  currentTrigger.setAttribute('aria-current', 'step')
  // if stepper is in linear mode, remove disabled attribute on current
  if (stepperNode.classList.contains(ClassName.LINEAR)) {
    currentTrigger.removeAttribute('disabled')
  }
}

const showContent = (content, contentList) => {
  if (content.classList.contains(ClassName.ACTIVE)) {
    return
  }

  function complete () {
    content.classList.add(ClassName.BLOCK)
    content.removeEventListener(transitionEndEvent, complete)
  }

  const activeContent = contentList.filter(content => content.classList.contains(ClassName.ACTIVE))
  if (activeContent.length) {
    activeContent[0].classList.remove(ClassName.ACTIVE)
    activeContent[0].classList.remove(ClassName.BLOCK)
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
  showContent,
  showStep,
  Selectors,
  ClassName,
  customProperty,
  detectAnimation
}
