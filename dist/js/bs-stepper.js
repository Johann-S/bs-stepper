/*!
 * bsStepper v1.0.0 (https://github.com/Johann-S/bs-stepper)
 * Copyright 2018 Johann-S <johann.servoire@gmail.com>
 * Licensed under MIT (https://github.com/Johann-S/bs-stepper/blob/master/LICENSE)
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.bsStepper = factory());
}(this, (function () { 'use strict';

  var Selectors = {
    STEPS: '.step'
  };
  var ClassName = {
    ACTIVE: 'active'
  };

  var showStep = function showStep(step, stepList) {
    if (step.classList.contains(ClassName.ACTIVE)) {
      return;
    }

    var activeStep = stepList.filter(function (step) {
      return step.classList.contains(ClassName.ACTIVE);
    });

    if (activeStep.length) {
      activeStep[0].classList.remove(ClassName.ACTIVE);
    }

    step.classList.add(ClassName.ACTIVE);
  };

  var showContent = function showContent(content, contentList) {
    if (content.classList.contains(ClassName.ACTIVE)) {
      return;
    }

    var activeContent = contentList.filter(function (content) {
      return content.classList.contains(ClassName.ACTIVE);
    });

    if (activeContent.length) {
      activeContent[0].classList.remove(ClassName.ACTIVE);
    }

    content.classList.add(ClassName.ACTIVE);
  };

  var bsStepper =
  /*#__PURE__*/
  function () {
    function bsStepper(element) {
      var _this = this;

      this._element = element;
      this._currentIndex = 0;
      this._stepsContents = [];
      this._steps = [].slice.call(this._element.querySelectorAll(Selectors.STEPS)).filter(function (step) {
        return step.hasAttribute('data-target');
      });

      this._steps.forEach(function (step) {
        _this._stepsContents.push(document.querySelector(step.getAttribute('data-target')));
      });

      if (this._steps.length) {
        showStep(this._steps[this._currentIndex], this._steps);
        showContent(this._stepsContents[this._currentIndex], this._stepsContents);
      }
    }

    var _proto = bsStepper.prototype;

    _proto.next = function next() {
      this._currentIndex = this._currentIndex + 1 <= this._steps.length - 1 ? this._currentIndex + 1 : 0;
      showStep(this._steps[this._currentIndex], this._steps);
      showContent(this._stepsContents[this._currentIndex], this._stepsContents);
    };

    _proto.destroy = function destroy() {
      this._element = undefined;
      this._currentIndex = undefined;
      this._steps = undefined;
      this._stepsContents = undefined;
    };

    return bsStepper;
  }();

  return bsStepper;

})));
//# sourceMappingURL=bs-stepper.js.map
