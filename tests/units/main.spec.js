/* eslint-env jasmine */
/* globals Stepper */

describe('Stepper', function () {
  var fixture

  beforeAll(function () {
    var fixureNode = document.createElement('div')
    fixureNode.setAttribute('id', 'fixture')

    document.body.appendChild(fixureNode)
    fixture = document.getElementById('fixture')
  })

  afterEach(function () {
    fixture.innerHTML = ''
  })

  describe('constructor', function () {
    it('should create a stepper', function () {
      fixture.innerHTML = [
        '<div id="myStepper" class="bs-stepper">',
        '  <div class="step" data-target="#test1">',
        '    <button class="step-trigger" id="trigger1">1</button>',
        '  </div>',
        '  <div class="step" data-target="#test2">',
        '    <button class="step-trigger" id="trigger2">2</button>',
        '  </div>',
        '  <div id="test1">1</div>',
        '  <div id="test2">2</div>',
        '</div>'
      ].join('')

      var stepperNode = document.getElementById('myStepper')
      var stepper = new Stepper(stepperNode)

      expect(stepperNode.classList.contains('linear')).toBe(true)
      expect(stepper._steps.length).toEqual(2)
      expect(stepperNode['bsStepper']).toEqual(stepper)
      expect(document.querySelector('.step').classList.contains('active')).toBe(true)
      expect(document.getElementById('trigger1').getAttribute('aria-selected')).toEqual('true')
      expect(document.getElementById('trigger2').getAttribute('aria-selected')).toEqual('false')
      expect(stepper.options).toEqual({
        linear: true,
        animation: false,
        selectors: {
          steps: '.step',
          trigger: '.step-trigger',
          stepper: '.bs-stepper'
        },
        classNames: {
          active: 'active',
          linear: 'linear',
          block: 'dstepper-block',
          none: 'dstepper-none',
          fade: 'fade'
        }
      })
    })

    it('should do nothing if there is no step', function () {
      fixture.innerHTML = '<div id="myStepper" class="bs-stepper"></div>'

      var stepperNode = document.getElementById('myStepper')
      var stepper = new Stepper(stepperNode)

      expect(stepperNode.classList.contains('linear')).toBe(true)
      expect(stepper._steps.length).toEqual(0)
      expect(stepperNode['bsStepper']).toEqual(stepper)
    })

    it('should create a non linear stepper', function () {
      fixture.innerHTML = [
        '<div id="myStepper" class="bs-stepper">',
        '  <div class="step" data-target="#test1">',
        '    <button class="step-trigger">1</button>',
        '  </div>',
        '  <div class="step" data-target="#test2">',
        '    <button class="step-trigger">2</button>',
        '  </div>',
        '  <div id="test1">1</div>',
        '  <div id="test2">2</div>',
        '</div>'
      ].join('')

      var stepperNode = document.getElementById('myStepper')
      var stepper = new Stepper(stepperNode, {
        linear: false
      })

      expect(stepperNode.classList.contains('linear')).toBe(false)
      expect(stepper._steps.length).toEqual(2)
      expect(document.querySelector('.step').classList.contains('active')).toBe(true)
      expect(stepperNode['bsStepper']).toEqual(stepper)
      expect(stepper.options).toEqual({
        linear: false,
        animation: false,
        selectors: {
          steps: '.step',
          trigger: '.step-trigger',
          stepper: '.bs-stepper'
        },
        classNames: {
          active: 'active',
          linear: 'linear',
          block: 'dstepper-block',
          none: 'dstepper-none',
          fade: 'fade'
        }
      })
    })

    it('should go to the next step when user click on a step for non linear stepper', function () {
      fixture.innerHTML = [
        '<div id="myStepper" class="bs-stepper">',
        '  <div class="step" data-target="#test1">',
        '    <button id="trigger1" class="step-trigger">1</button>',
        '  </div>',
        '  <div class="step" data-target="#test2">',
        '    <button id="trigger2" class="step-trigger">2</button>',
        '  </div>',
        '  <div id="test1">1</div>',
        '  <div id="test2">2</div>',
        '</div>'
      ].join('')

      var stepperNode = document.getElementById('myStepper')
      var stepper = new Stepper(stepperNode, {
        linear: false
      })

      var trigger2 = document.querySelector('#trigger2')
      trigger2.click()

      expect(document.querySelector('#test1').classList.contains('active')).toBe(false)
      expect(document.querySelector('#test2').classList.contains('active')).toBe(true)
      expect(document.getElementById('trigger1').getAttribute('aria-selected')).toEqual('false')
      expect(document.getElementById('trigger2').getAttribute('aria-selected')).toEqual('true')
      expect(stepper._currentIndex).toEqual(1)
    })

    it('should call preventDefault when user click on a step for linear stepper', function () {
      fixture.innerHTML = [
        '<div id="myStepper" class="bs-stepper">',
        '  <div class="step" data-target="#test1">',
        '    <button class="step-trigger">1</button>',
        '  </div>',
        '  <div class="step" data-target="#test2">',
        '    <button id="trigger2" class="step-trigger">2</button>',
        '  </div>',
        '  <div id="test1">1</div>',
        '  <div id="test2">2</div>',
        '</div>'
      ].join('')

      var stepperNode = document.getElementById('myStepper')
      var stepper = new Stepper(stepperNode)

      var trigger2 = document.querySelector('#trigger2')
      trigger2.removeAttribute('disabled')
      var clickEvent = document.createEvent('Event')
      clickEvent.initEvent('click', true, true)

      spyOn(clickEvent, 'preventDefault')

      trigger2.dispatchEvent(clickEvent)

      expect(clickEvent.preventDefault).toHaveBeenCalled()
      expect(stepper._currentIndex).toEqual(0)
    })

    it('should create a stepper with fade animation', function (done) {
      fixture.innerHTML = [
        '<div id="myStepper" class="bs-stepper">',
        '  <div class="step" data-target="#test1">',
        '    <button class="step-trigger">1</button>',
        '  </div>',
        '  <div class="step" data-target="#test2">',
        '    <button class="step-trigger">2</button>',
        '  </div>',
        '  <div id="test1">1</div>',
        '  <div id="test2">2</div>',
        '</div>'
      ].join('')

      var stepperNode = document.getElementById('myStepper')
      var stepper = new Stepper(stepperNode, {
        animation: true
      })

      setTimeout(function () {
        expect(stepper.options).toEqual({
          linear: true,
          animation: true,
          selectors: {
            steps: '.step',
            trigger: '.step-trigger',
            stepper: '.bs-stepper'
          },
          classNames: {
            active: 'active',
            linear: 'linear',
            block: 'dstepper-block',
            none: 'dstepper-none',
            fade: 'fade'
          }
        })
        expect(document.querySelector('#test1').classList.contains('fade')).toBe(true)
        expect(document.querySelector('#test2').classList.contains('fade')).toBe(true)
        done()
      }, 10)
    })

    it('should add event listeners on triggers', function () {
      fixture.innerHTML = [
        '<div id="myStepper" class="bs-stepper">',
        '  <div class="step" data-target="#test1">',
        '    <button id="trigger1" class="step-trigger">1</button>',
        '  </div>',
        '  <div class="step" data-target="#test2">',
        '    <button id="trigger2" class="step-trigger">2</button>',
        '  </div>',
        '  <div id="test1">1</div>',
        '  <div id="test2">2</div>',
        '</div>'
      ].join('')

      var trigger1 = document.querySelector('#trigger1')
      var trigger2 = document.querySelector('#trigger2')

      spyOn(trigger1, 'addEventListener')
      spyOn(trigger2, 'addEventListener')

      var stepperNode = document.getElementById('myStepper')
      var stepper = new Stepper(stepperNode)

      expect(trigger1.addEventListener).toHaveBeenCalled()
      expect(trigger2.addEventListener).toHaveBeenCalled()
      expect(stepperNode['bsStepper']).toEqual(stepper)
    })
  })

  describe('next', function () {
    it('should go to the next step', function (done) {
      fixture.innerHTML = [
        '<div id="myStepper" class="bs-stepper">',
        '  <div class="step" data-target="#test1">',
        '    <button class="step-trigger">1</button>',
        '  </div>',
        '  <div class="step" data-target="#test2">',
        '    <button class="step-trigger">2</button>',
        '  </div>',
        '  <div id="test1">1</div>',
        '  <div id="test2">2</div>',
        '</div>'
      ].join('')

      var stepperNode = document.getElementById('myStepper')
      var stepper = new Stepper(stepperNode)

      stepperNode.addEventListener('show.bs-stepper', function (event) {
        expect(event.detail.indexStep).toEqual(1)
      })
      stepperNode.addEventListener('shown.bs-stepper', function (event) {
        expect(event.detail.indexStep).toEqual(1)
        expect(document.querySelector('#test1').classList.contains('active')).toBe(false)
        expect(document.querySelector('#test2').classList.contains('active')).toBe(true)
        done()
      })

      stepper.next()
    })

    it('should not go to the next step if the show event is default prevented', function (done) {
      fixture.innerHTML = [
        '<div id="myStepper" class="bs-stepper">',
        '  <div class="step" data-target="#test1">',
        '    <button class="step-trigger">1</button>',
        '  </div>',
        '  <div class="step" data-target="#test2">',
        '    <button class="step-trigger">2</button>',
        '  </div>',
        '  <div id="test1">1</div>',
        '  <div id="test2">2</div>',
        '</div>'
      ].join('')

      var stepperNode = document.getElementById('myStepper')
      var stepper = new Stepper(stepperNode)
      var listeners = {
        show: function (event) {
          event.preventDefault()
          expect(event.detail.indexStep).toEqual(1)

          setTimeout(function () {
            expect(listeners.shown).not.toHaveBeenCalled()
            done()
          }, 10)
        },
        shown: function (event) {
          console.warn('shown called but it should not be the case')
        }
      }

      spyOn(listeners, 'shown')

      stepperNode.addEventListener('show.bs-stepper', listeners.show)
      stepperNode.addEventListener('shown.bs-stepper', listeners.shown)

      stepper.next()
    })

    it('should stay at the end if we call next', function () {
      fixture.innerHTML = [
        '<div id="myStepper" class="bs-stepper">',
        '  <div class="step" data-target="#test1">',
        '    <button class="step-trigger">1</button>',
        '  </div>',
        '  <div class="step" data-target="#test2">',
        '    <button class="step-trigger">2</button>',
        '  </div>',
        '  <div id="test1">1</div>',
        '  <div id="test2">2</div>',
        '</div>'
      ].join('')

      var stepperNode = document.getElementById('myStepper')
      var stepper = new Stepper(stepperNode)

      stepper.next()
      stepper.next()

      expect(document.querySelector('#test1').classList.contains('active')).toBe(false)
      expect(document.querySelector('#test2').classList.contains('active')).toBe(true)
    })
  })

  describe('previous', function () {
    it('should return to the previous step', function () {
      fixture.innerHTML = [
        '<div id="myStepper" class="bs-stepper">',
        '  <div class="step" data-target="#test1">',
        '    <button class="step-trigger">1</button>',
        '  </div>',
        '  <div class="step" data-target="#test2">',
        '    <button class="step-trigger">2</button>',
        '  </div>',
        '  <div id="test1">1</div>',
        '  <div id="test2">2</div>',
        '</div>'
      ].join('')

      var stepperNode = document.getElementById('myStepper')
      var stepper = new Stepper(stepperNode)
      var test1 = document.querySelector('#test1')
      var test2 = document.querySelector('#test2')

      stepper.next()

      expect(test1.classList.contains('active')).toBe(false)
      expect(test2.classList.contains('active')).toBe(true)

      stepper.previous()

      expect(test1.classList.contains('active')).toBe(true)
      expect(test2.classList.contains('active')).toBe(false)
    })

    it('should stay at the first step if previous called', function () {
      fixture.innerHTML = [
        '<div id="myStepper" class="bs-stepper">',
        '  <div class="step" data-target="#test1">',
        '    <button class="step-trigger">1</button>',
        '  </div>',
        '  <div class="step" data-target="#test2">',
        '    <button class="step-trigger">2</button>',
        '  </div>',
        '  <div id="test1">1</div>',
        '  <div id="test2">2</div>',
        '</div>'
      ].join('')

      var test1 = document.querySelector('#test1')
      var test2 = document.querySelector('#test2')

      var stepperNode = document.getElementById('myStepper')
      var stepper = new Stepper(stepperNode)

      stepper.previous()

      expect(test1.classList.contains('active')).toBe(true)
      expect(test2.classList.contains('active')).toBe(false)
    })
  })

  describe('to', function () {
    it('should go to the step number', function () {
      fixture.innerHTML = [
        '<div id="myStepper" class="bs-stepper">',
        '  <div class="step" data-target="#test1">',
        '    <button class="step-trigger">1</button>',
        '  </div>',
        '  <div class="step" data-target="#test2">',
        '    <button class="step-trigger">2</button>',
        '  </div>',
        '  <div id="test1">1</div>',
        '  <div id="test2">2</div>',
        '</div>'
      ].join('')

      var stepperNode = document.getElementById('myStepper')
      var stepper = new Stepper(stepperNode)
      var test1 = document.querySelector('#test1')
      var test2 = document.querySelector('#test2')

      stepper.to(2)

      expect(test1.classList.contains('active')).toBe(false)
      expect(test2.classList.contains('active')).toBe(true)
    })

    it('should handle wrong inputs', function () {
      fixture.innerHTML = [
        '<div id="myStepper" class="bs-stepper">',
        '  <div class="step" data-target="#test1">',
        '    <button class="step-trigger">1</button>',
        '  </div>',
        '  <div class="step" data-target="#test2">',
        '    <button class="step-trigger">2</button>',
        '  </div>',
        '  <div class="step" data-target="#test3">',
        '    <button class="step-trigger">3</button>',
        '  </div>',
        '  <div id="test1">1</div>',
        '  <div id="test2">2</div>',
        '  <div id="test3">2</div>',
        '</div>'
      ].join('')

      var stepperNode = document.getElementById('myStepper')
      var stepper = new Stepper(stepperNode)
      var test1 = document.querySelector('#test1')
      var test2 = document.querySelector('#test2')
      var test3 = document.querySelector('#test3')

      stepper.to(-5)

      expect(test1.classList.contains('active')).toBe(true)
      expect(test2.classList.contains('active')).toBe(false)
      expect(test3.classList.contains('active')).toBe(false)

      stepper.to(2)

      expect(test1.classList.contains('active')).toBe(false)
      expect(test2.classList.contains('active')).toBe(true)
      expect(test3.classList.contains('active')).toBe(false)

      stepper.to(stepper._steps.length + 1)

      expect(test1.classList.contains('active')).toBe(true)
      expect(test2.classList.contains('active')).toBe(false)
      expect(test3.classList.contains('active')).toBe(false)
    })
  })

  describe('reset', function () {
    it('should return to the first step', function () {
      fixture.innerHTML = [
        '<div id="myStepper" class="bs-stepper">',
        '  <div class="step" data-target="#test1">',
        '    <button class="step-trigger">1</button>',
        '  </div>',
        '  <div class="step" data-target="#test2">',
        '    <button class="step-trigger">2</button>',
        '  </div>',
        '  <div id="test1">1</div>',
        '  <div id="test2">2</div>',
        '</div>'
      ].join('')

      var stepperNode = document.getElementById('myStepper')
      var stepper = new Stepper(stepperNode)
      var test1 = document.querySelector('#test1')
      var test2 = document.querySelector('#test2')

      stepper.next()

      expect(test1.classList.contains('active')).toBe(false)
      expect(test2.classList.contains('active')).toBe(true)

      stepper.reset()

      expect(test1.classList.contains('active')).toBe(true)
      expect(test2.classList.contains('active')).toBe(false)
    })
  })

  describe('destroy', function () {
    it('should clear properties', function () {
      fixture.innerHTML = [
        '<div id="myStepper" class="bs-stepper">',
        '  <div class="step" data-target="#test1">',
        '    <button class="step-trigger">1</button>',
        '  </div>',
        '  <div class="step" data-target="#test2">',
        '    <button class="step-trigger">2</button>',
        '  </div>',
        '  <div id="test1">1</div>',
        '  <div id="test2">2</div>',
        '</div>'
      ].join('')

      var stepperNode = document.getElementById('myStepper')
      var stepper = new Stepper(stepperNode)

      expect(stepperNode['bsStepper']).toEqual(stepper)
      expect(stepper._element).toEqual(stepperNode)
      expect(stepper._currentIndex).toEqual(0)
      expect(stepper._steps.length).toEqual(2)
      expect(stepper._stepsContents.length).toEqual(2)

      stepper.destroy()

      expect(stepperNode.bsStepper).toBeUndefined()
      expect(stepper._element).toBeUndefined()
      expect(stepper._currentIndex).toBeUndefined()
      expect(stepper._steps).toBeUndefined()
      expect(stepper._stepsContents).toBeUndefined()
    })

    it('should remove event listeners on triggers', function () {
      fixture.innerHTML = [
        '<div id="myStepper" class="bs-stepper">',
        '  <div class="step" data-target="#test1">',
        '    <button id="trigger1" class="step-trigger">1</button>',
        '  </div>',
        '  <div class="step" data-target="#test2">',
        '    <button id="trigger2" class="step-trigger">2</button>',
        '  </div>',
        '  <div id="test1">1</div>',
        '  <div id="test2">2</div>',
        '</div>'
      ].join('')

      var stepperNode = document.getElementById('myStepper')
      var stepper = new Stepper(stepperNode, { linear: false })

      var trigger1 = document.querySelector('#trigger1')
      var trigger2 = document.querySelector('#trigger2')

      spyOn(trigger1, 'removeEventListener')
      spyOn(trigger2, 'removeEventListener')

      stepper.destroy()

      expect(trigger1.removeEventListener).toHaveBeenCalled()
      expect(trigger2.removeEventListener).toHaveBeenCalled()
    })
  })
})
