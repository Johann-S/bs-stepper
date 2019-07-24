import { WinEvent, createCustomEvent } from './polyfill'

const MILLISECONDS_MULTIPLIER = 1000

const ClassName = {
  ACTIVE: 'active',
  LINEAR: 'linear',
  BLOCK: 'dstepper-block',
  NONE: 'dstepper-none',
  FADE: 'fade',
  VERTICAL: 'vertical'
}

const transitionEndEvent = 'transitionend'
const customProperty = 'bsStepper'

const show = (stepperNode, indexStep, options, done) => {
  const stepper = stepperNode[customProperty]

  if (stepper._steps[indexStep].classList.contains(ClassName.ACTIVE) || stepper._stepsContents[indexStep].classList.contains(ClassName.ACTIVE)) {
    return
  }

  const showEvent = createCustomEvent('show.bs-stepper', {
    cancelable: true,
    detail: {
      from: stepper._currentIndex,
      to: indexStep,
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

    if (!stepperNode.classList.contains(ClassName.VERTICAL) && !stepper.options.animation) {
      activeContent[0].classList.remove(ClassName.BLOCK)
    }
  }

  showStep(stepperNode, stepper._steps[indexStep], stepper._steps, options)
  showContent(stepperNode, stepper._stepsContents[indexStep], stepper._stepsContents, activeContent, done)
}

const showStep = (stepperNode, step, stepList, options) => {
  stepList.forEach(step => {
    const trigger = step.querySelector(options.selectors.trigger)

    trigger.setAttribute('aria-selected', 'false')
    // if stepper is in linear mode, set disabled attribute on the trigger
    if (stepperNode.classList.contains(ClassName.LINEAR)) {
      trigger.setAttribute('disabled', 'disabled')
    }
  })

  step.classList.add(ClassName.ACTIVE)
  const currentTrigger = step.querySelector(options.selectors.trigger)

  currentTrigger.setAttribute('aria-selected', 'true')
  // if stepper is in linear mode, remove disabled attribute on current
  if (stepperNode.classList.contains(ClassName.LINEAR)) {
    currentTrigger.removeAttribute('disabled')
  }
}

const showContent = (stepperNode, content, contentList, activeContent, done) => {
  const stepper = stepperNode[customProperty]
  const toIndex = contentList.indexOf(content)
  const shownEvent = createCustomEvent('shown.bs-stepper', {
    cancelable: true,
    detail: {
      from: stepper._currentIndex,
      to: toIndex,
      indexStep: toIndex
    }
  })

  function complete () {
    content.classList.add(ClassName.BLOCK)
    content.removeEventListener(transitionEndEvent, complete)
    stepperNode.dispatchEvent(shownEvent)
    done()
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
    content.classList.add(ClassName.BLOCK)
    stepperNode.dispatchEvent(shownEvent)
    done()
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
      content.classList.add(ClassName.FADE)
      content.classList.add(ClassName.NONE)
    })
  }
}

export {
  show,
  ClassName,
  customProperty,
  detectAnimation
}
