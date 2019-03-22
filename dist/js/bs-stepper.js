/*!
 * bsStepper v1.5.0 (https://github.com/Johann-S/bs-stepper)
 * Copyright 2018 - 2019 Johann-S <johann.servoire@gmail.com>
 * Licensed under MIT (https://github.com/Johann-S/bs-stepper/blob/master/LICENSE)
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Stepper = factory());
}(this, function () { 'use strict';

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  var matches = window.Element.prototype.matches;

  var closest = function closest(element, selector) {
    return element.closest(selector);
  };

  var WinEvent = function WinEvent(inType, params) {
    return new window.Event(inType, params);
  };

  var createCustomEvent = function createCustomEvent(eventName, params) {
    var cEvent = new window.CustomEvent(eventName, params);
    return cEvent;
  };
  /* istanbul ignore next */


  function polyfill() {
    if (!window.Element.prototype.matches) {
      matches = window.Element.prototype.msMatchesSelector || window.Element.prototype.webkitMatchesSelector;
    }

    if (!window.Element.prototype.closest) {
      closest = function closest(element, selector) {
        if (!document.documentElement.contains(element)) {
          return null;
        }

        do {
          if (matches.call(element, selector)) {
            return element;
          }

          element = element.parentElement || element.parentNode;
        } while (element !== null && element.nodeType === 1);

        return null;
      };
    }

    if (!window.Event || typeof window.Event !== 'function') {
      WinEvent = function WinEvent(inType, params) {
        params = params || {};
        var e = document.createEvent('Event');
        e.initEvent(inType, Boolean(params.bubbles), Boolean(params.cancelable));
        return e;
      };
    }

    if (typeof window.CustomEvent !== 'function') {
      var originPreventDefault = window.Event.prototype.preventDefault;

      createCustomEvent = function createCustomEvent(eventName, params) {
        var evt = document.createEvent('CustomEvent');
        params = params || {
          bubbles: false,
          cancelable: false,
          detail: null
        };
        evt.initCustomEvent(eventName, params.bubbles, params.cancelable, params.detail);

        evt.preventDefault = function () {
          if (!this.cancelable) {
            return;
          }

          originPreventDefault.call(this);
          Object.defineProperty(this, 'defaultPrevented', {
            get: function get() {
              return true;
            }
          });
        };

        return evt;
      };
    }
  }

  polyfill();

  var MILLISECONDS_MULTIPLIER = 1000;
  var Selectors = {
    STEPS: '.step',
    TRIGGER: '.step-trigger',
    STEPPER: '.bs-stepper'
  };
  var ClassName = {
    ACTIVE: 'active',
    LINEAR: 'linear',
    BLOCK: 'dstepper-block',
    NONE: 'dstepper-none',
    FADE: 'fade'
  };
  var transitionEndEvent = 'transitionend';
  var customProperty = 'bsStepper';

  var show = function show(stepperNode, indexStep) {
    var stepper = stepperNode[customProperty];

    if (stepper._steps[indexStep].classList.contains(ClassName.ACTIVE) || stepper._stepsContents[indexStep].classList.contains(ClassName.ACTIVE)) {
      return;
    }

    var showEvent = createCustomEvent('show.bs-stepper', {
      cancelable: true,
      detail: {
        indexStep: indexStep
      }
    });
    stepperNode.dispatchEvent(showEvent);

    var activeStep = stepper._steps.filter(function (step) {
      return step.classList.contains(ClassName.ACTIVE);
    });

    var activeContent = stepper._stepsContents.filter(function (content) {
      return content.classList.contains(ClassName.ACTIVE);
    });

    if (showEvent.defaultPrevented) {
      return;
    }

    if (activeStep.length) {
      activeStep[0].classList.remove(ClassName.ACTIVE);
    }

    if (activeContent.length) {
      activeContent[0].classList.remove(ClassName.ACTIVE);
      activeContent[0].classList.remove(ClassName.BLOCK);
    }

    showStep(stepperNode, stepper._steps[indexStep], stepper._steps);
    showContent(stepperNode, stepper._stepsContents[indexStep], stepper._stepsContents, activeContent);
  };

  var showStep = function showStep(stepperNode, step, stepList) {
    stepList.forEach(function (step) {
      var trigger = step.querySelector(Selectors.TRIGGER);
      trigger.setAttribute('aria-selected', 'false'); // if stepper is in linear mode, set disabled attribute on the trigger

      if (stepperNode.classList.contains(ClassName.LINEAR)) {
        trigger.setAttribute('disabled', 'disabled');
      }
    });
    step.classList.add(ClassName.ACTIVE);
    var currentTrigger = step.querySelector(Selectors.TRIGGER);
    currentTrigger.setAttribute('aria-selected', 'true'); // if stepper is in linear mode, remove disabled attribute on current

    if (stepperNode.classList.contains(ClassName.LINEAR)) {
      currentTrigger.removeAttribute('disabled');
    }
  };

  var showContent = function showContent(stepperNode, content, contentList, activeContent) {
    var shownEvent = createCustomEvent('shown.bs-stepper', {
      cancelable: true,
      detail: {
        indexStep: contentList.indexOf(content)
      }
    });

    function complete() {
      content.classList.add(ClassName.BLOCK);
      content.removeEventListener(transitionEndEvent, complete);
      stepperNode.dispatchEvent(shownEvent);
    }

    if (content.classList.contains(ClassName.FADE)) {
      content.classList.remove(ClassName.NONE);
      var duration = getTransitionDurationFromElement(content);
      content.addEventListener(transitionEndEvent, complete);

      if (activeContent.length) {
        activeContent[0].classList.add(ClassName.NONE);
      }

      content.classList.add(ClassName.ACTIVE);
      emulateTransitionEnd(content, duration);
    } else {
      content.classList.add(ClassName.ACTIVE);
      stepperNode.dispatchEvent(shownEvent);
    }
  };

  var getTransitionDurationFromElement = function getTransitionDurationFromElement(element) {
    if (!element) {
      return 0;
    } // Get transition-duration of the element


    var transitionDuration = window.getComputedStyle(element).transitionDuration;
    var floatTransitionDuration = parseFloat(transitionDuration); // Return 0 if element or transition duration is not found

    if (!floatTransitionDuration) {
      return 0;
    } // If multiple durations are defined, take the first


    transitionDuration = transitionDuration.split(',')[0];
    return parseFloat(transitionDuration) * MILLISECONDS_MULTIPLIER;
  };

  var emulateTransitionEnd = function emulateTransitionEnd(element, duration) {
    var called = false;
    var durationPadding = 5;
    var emulatedDuration = duration + durationPadding;

    function listener() {
      called = true;
      element.removeEventListener(transitionEndEvent, listener);
    }

    element.addEventListener(transitionEndEvent, listener);
    window.setTimeout(function () {
      if (!called) {
        element.dispatchEvent(WinEvent(transitionEndEvent));
      }

      element.removeEventListener(transitionEndEvent, listener);
    }, emulatedDuration);
  };

  var detectAnimation = function detectAnimation(contentList, animation) {
    if (animation) {
      contentList.forEach(function (content) {
        content.classList.add(ClassName.FADE);
        content.classList.add(ClassName.NONE);
      });
    }
  };

  function clickStepLinearListener(event) {
    event.preventDefault();
  }

  function clickStepNonLinearListener(event) {
    event.preventDefault();
    var step = closest(event.target, Selectors.STEPS);
    var stepperNode = closest(step, Selectors.STEPPER);
    var stepper = stepperNode[customProperty];

    var stepIndex = stepper._steps.indexOf(step);

    stepper._currentIndex = stepIndex;
    show(stepperNode, stepIndex);
  }

  var DEFAULT_OPTIONS = {
    linear: true,
    animation: false
  };

  var Stepper =
  /*#__PURE__*/
  function () {
    function Stepper(element, _options) {
      var _this = this;

      if (_options === void 0) {
        _options = {};
      }

      this._element = element;
      this._currentIndex = 0;
      this._stepsContents = [];
      this._steps = [].slice.call(this._element.querySelectorAll(Selectors.STEPS)).filter(function (step) {
        return step.hasAttribute('data-target');
      });

      this._steps.forEach(function (step) {
        _this._stepsContents.push(_this._element.querySelector(step.getAttribute('data-target')));
      });

      this.options = _extends({}, DEFAULT_OPTIONS, _options);

      if (this.options.linear) {
        this._element.classList.add(ClassName.LINEAR);
      }

      detectAnimation(this._stepsContents, this.options.animation);

      this._setLinkListeners();

      Object.defineProperty(this._element, customProperty, {
        value: this,
        writable: true
      });

      if (this._steps.length) {
        show(this._element, this._currentIndex);
      }
    } // Private


    var _proto = Stepper.prototype;

    _proto._setLinkListeners = function _setLinkListeners() {
      var _this2 = this;

      this._steps.forEach(function (step) {
        var trigger = step.querySelector(Selectors.TRIGGER);

        if (_this2.options.linear) {
          trigger.addEventListener('click', clickStepLinearListener);
        } else {
          trigger.addEventListener('click', clickStepNonLinearListener);
        }
      });
    } // Public
    ;

    _proto.next = function next() {
      this._currentIndex = this._currentIndex + 1 <= this._steps.length - 1 ? this._currentIndex + 1 : this._steps.length - 1;
      show(this._element, this._currentIndex);
    };

    _proto.previous = function previous() {
      this._currentIndex = this._currentIndex - 1 >= 0 ? this._currentIndex - 1 : 0;
      show(this._element, this._currentIndex);
    };

    _proto.to = function to(stepNumber) {
      var tempIndex = stepNumber - 1;
      this._currentIndex = tempIndex >= 0 && tempIndex < this._steps.length ? tempIndex : 0;
      show(this._element, this._currentIndex);
    };

    _proto.reset = function reset() {
      this._currentIndex = 0;
      show(this._element, this._currentIndex);
    };

    _proto.destroy = function destroy() {
      var _this3 = this;

      this._steps.forEach(function (step) {
        var trigger = step.querySelector(Selectors.TRIGGER);

        if (_this3.options.linear) {
          trigger.removeEventListener('click', clickStepLinearListener);
        } else {
          trigger.removeEventListener('click', clickStepNonLinearListener);
        }
      });

      this._element[customProperty] = undefined;
      this._element = undefined;
      this._currentIndex = undefined;
      this._steps = undefined;
      this._stepsContents = undefined;
    };

    return Stepper;
  }();

  return Stepper;

}));
//# sourceMappingURL=bs-stepper.js.map
