import { WinEvent } from './polyfill'

const MILLISECONDS_MULTIPLIER = 1000
const Selectors = {
  STEPS: '.step',
  LINK: 'a',
  STEPPER: '.bs-stepper'
}

const ClassName = {
  ACTIVE: 'active',
  LINEAR: 'linear',
  BLOCK: 'd-block',
  NONE: 'd-none',
  FADE: 'fade'
}

const transitionEndEvent = 'transitionend'
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
    activeContent[0].classList.remove(ClassName.BLOCK)
  }

  if (content.classList.contains(ClassName.FADE)) {
    content.classList.remove(ClassName.NONE)

    function complete() {
      content.classList.add(ClassName.BLOCK)
      content.removeEventListener(transitionEndEvent, complete)
    }

    const duration = getTransitionDurationFromElement(content)
    content.addEventListener(transitionEndEvent, complete)
    if (activeContent.length) {
      activeContent[0].classList.add('d-none')
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
  function listener() {
    called = true
    element.removeEventListener(transitionEndEvent, listener)
  }

  element.addEventListener(transitionEndEvent, listener)
  window.setTimeout(() => {
    if (!called) {
      element.dispatchEvent(WinEvent(transitionEndEvent))
    }
  }, emulatedDuration)
}

const detectFade = contentList => {
  const contentFadeList = contentList.filter(content => content.classList.contains(ClassName.FADE))

  if (contentFadeList.length) {
    contentFadeList.forEach(content => content.classList.add(ClassName.NONE))
  }
}

export {
  showContent,
  showStep,
  Selectors,
  ClassName,
  customProperty,
  detectFade,
}
