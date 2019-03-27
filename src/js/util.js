import { WinEvent, createCustomEvent } from './polyfill'

const MILLISECONDS_MULTIPLIER = 1000

const transitionEndEvent = 'transitionend'
const customProperty = 'bsStepper'

const show = (stepperNode, indexStep, options) => {
  const stepper = stepperNode[customProperty]

  if (stepper._steps[indexStep].classList.contains(options.classNames.active) || stepper._stepsContents[indexStep].classList.contains(options.classNames.active)) {
    return
  }

  const showEvent = createCustomEvent('show.bs-stepper', {
    cancelable: true,
    detail: {
      indexStep
    }
  })
  stepperNode.dispatchEvent(showEvent)

  const activeStep = stepper._steps.filter(step => step.classList.contains(options.classNames.active))
  const activeContent = stepper._stepsContents.filter(content => content.classList.contains(options.classNames.active))

  if (showEvent.defaultPrevented) {
    return
  }

  if (activeStep.length) {
    activeStep[0].classList.remove(options.classNames.active)
  }
  if (activeContent.length) {
    activeContent[0].classList.remove(options.classNames.active)
    activeContent[0].classList.remove(options.classNames.block)
  }

  showStep(stepperNode, stepper._steps[indexStep], stepper._steps, options)
  showContent(stepperNode, stepper._stepsContents[indexStep], stepper._stepsContents, activeContent, options)
}

const showStep = (stepperNode, step, stepList, options) => {
  stepList.forEach(step => {
    const trigger = step.querySelector(options.selectors.trigger)

    trigger.setAttribute('aria-selected', 'false')
    // if stepper is in linear mode, set disabled attribute on the trigger
    if (stepperNode.classList.contains(options.classNames.linear)) {
      trigger.setAttribute('disabled', 'disabled')
    }
  })

  step.classList.add(options.classNames.active)
  const currentTrigger = step.querySelector(options.selectors.trigger)

  currentTrigger.setAttribute('aria-selected', 'true')
  // if stepper is in linear mode, remove disabled attribute on current
  if (stepperNode.classList.contains(options.classNames.linear)) {
    currentTrigger.removeAttribute('disabled')
  }
}

const showContent = (stepperNode, content, contentList, activeContent, options) => {
  const shownEvent = createCustomEvent('shown.bs-stepper', {
    cancelable: true,
    detail: {
      indexStep: contentList.indexOf(content)
    }
  })

  function complete () {
    content.classList.add(options.classNames.block)
    content.removeEventListener(transitionEndEvent, complete)
    stepperNode.dispatchEvent(shownEvent)
  }

  if (content.classList.contains(options.classNames.fade)) {
    content.classList.remove(options.classNames.none)
    const duration = getTransitionDurationFromElement(content)

    content.addEventListener(transitionEndEvent, complete)
    if (activeContent.length) {
      activeContent[0].classList.add(options.classNames.none)
    }

    content.classList.add(options.classNames.active)
    emulateTransitionEnd(content, duration)
  } else {
    content.classList.add(options.classNames.active)
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

const detectAnimation = (contentList, options) => {
  if (options.animation) {
    contentList.forEach(content => {
      content.classList.add(options.classNames.fade)
      content.classList.add(options.classNames.none)
    })
  }
}

export {
  show,
  customProperty,
  detectAnimation
}
