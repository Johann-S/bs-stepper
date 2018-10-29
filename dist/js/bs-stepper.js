/*!
 * bsStepper v1.3.0 (https://github.com/Johann-S/bs-stepper)
 * Copyright 2018 Johann-S <johann.servoire@gmail.com>
 * Licensed under MIT (https://github.com/Johann-S/bs-stepper/blob/master/LICENSE)
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Stepper = factory());
}(this, (function () { 'use strict';

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
  }

  polyfill();

  var MILLISECONDS_MULTIPLIER = 1000;
  var Selectors = {
    STEPS: '.step',
    TRIGGER: '.step-trigger, a',
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

  var showStep = function showStep(step, stepList) {
    if (step.classList.contains(ClassName.ACTIVE)) {
      return;
    }

    var stepperNode = closest(step, Selectors.STEPPER);
    var activeStep = stepList.filter(function (step) {
      return step.classList.contains(ClassName.ACTIVE);
    });

    if (activeStep.length) {
      activeStep[0].classList.remove(ClassName.ACTIVE);
    }

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

  var showContent = function showContent(content, contentList) {
    if (content.classList.contains(ClassName.ACTIVE)) {
      return;
    }

    function complete() {
      content.classList.add(ClassName.BLOCK);
      content.removeEventListener(transitionEndEvent, complete);
    }

    var activeContent = contentList.filter(function (content) {
      return content.classList.contains(ClassName.ACTIVE);
    });

    if (activeContent.length) {
      activeContent[0].classList.remove(ClassName.ACTIVE);
      activeContent[0].classList.remove(ClassName.BLOCK);
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
    showStep(step, stepper._steps);
    showContent(stepper._stepsContents[stepIndex], stepper._stepsContents);
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

      if (this._steps.length) {
        showStep(this._steps[this._currentIndex], this._steps);
        showContent(this._stepsContents[this._currentIndex], this._stepsContents);
      }

      this._setLinkListeners();

      Object.defineProperty(this._element, customProperty, {
        value: this,
        writable: true
      });
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
    }; // Public


    _proto.next = function next() {
      this._currentIndex = this._currentIndex + 1 <= this._steps.length - 1 ? this._currentIndex + 1 : this._steps.length - 1;
      showStep(this._steps[this._currentIndex], this._steps);
      showContent(this._stepsContents[this._currentIndex], this._stepsContents);
    };

    _proto.previous = function previous() {
      this._currentIndex = this._currentIndex - 1 >= 0 ? this._currentIndex - 1 : 0;
      showStep(this._steps[this._currentIndex], this._steps);
      showContent(this._stepsContents[this._currentIndex], this._stepsContents);
    };

    _proto.reset = function reset() {
      this._currentIndex = 0;
      showStep(this._steps[this._currentIndex], this._steps);
      showContent(this._stepsContents[this._currentIndex], this._stepsContents);
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

})));
//# sourceMappingURL=bs-stepper.js.map
