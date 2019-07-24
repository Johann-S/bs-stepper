/* eslint-env jasmine */
import Stepper from './index'

describe('Stepper', () => {
  let fixture

  beforeAll(() => {
    const fixureNode = document.createElement('div')
    fixureNode.setAttribute('id', 'fixture')

    document.body.appendChild(fixureNode)
    fixture = document.getElementById('fixture')
  })

  afterEach(() => {
    fixture.innerHTML = ''
  })

  describe('constructor', () => {
    it('should create a stepper', () => {
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

      const stepperNode = document.getElementById('myStepper')
      const stepper = new Stepper(stepperNode)

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
        }
      })
    })

    it('should do nothing if there is no step', () => {
      fixture.innerHTML = '<div id="myStepper" class="bs-stepper"></div>'

      const stepperNode = document.getElementById('myStepper')
      const stepper = new Stepper(stepperNode)

      expect(stepperNode.classList.contains('linear')).toBe(true)
      expect(stepper._steps.length).toEqual(0)
      expect(stepperNode['bsStepper']).toEqual(stepper)
    })

    it('should create a non linear stepper', () => {
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

      const stepperNode = document.getElementById('myStepper')
      const stepper = new Stepper(stepperNode, {
        linear: false
      })

      expect(stepperNode.classList.contains('linear')).toBe(false)
      expect(stepper._steps.length).toEqual(2)
      expect(document.querySelector('.step').classList.contains('active')).toBe(true)
      expect(stepperNode['bsStepper']).toEqual(stepper)
      expect(stepper._clickStepLinearListener).toBeUndefined()
      expect(stepper._clickStepNonLinearListener).toBeTruthy()
      expect(stepper.options).toEqual({
        linear: false,
        animation: false,
        selectors: {
          steps: '.step',
          trigger: '.step-trigger',
          stepper: '.bs-stepper'
        }
      })
    })

    it('should go to the next step when user click on a step for non linear stepper', () => {
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

      const stepperNode = document.getElementById('myStepper')
      const stepper = new Stepper(stepperNode, {
        linear: false
      })

      const trigger2 = document.querySelector('#trigger2')
      trigger2.click()

      expect(document.querySelector('#test1').classList.contains('active')).toBe(false)
      expect(document.querySelector('#test2').classList.contains('active')).toBe(true)
      expect(document.getElementById('trigger1').getAttribute('aria-selected')).toEqual('false')
      expect(document.getElementById('trigger2').getAttribute('aria-selected')).toEqual('true')
      expect(stepper._currentIndex).toEqual(1)
    })

    it('should call preventDefault when user click on a step for linear stepper', () => {
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

      const stepperNode = document.getElementById('myStepper')
      const stepper = new Stepper(stepperNode)

      const trigger2 = document.querySelector('#trigger2')
      trigger2.removeAttribute('disabled')
      const clickEvent = document.createEvent('Event')
      clickEvent.initEvent('click', true, true)

      spyOn(clickEvent, 'preventDefault')

      trigger2.dispatchEvent(clickEvent)

      expect(clickEvent.preventDefault).toHaveBeenCalled()
      expect(stepper._currentIndex).toEqual(0)
    })

    it('should create a stepper with fade animation', done => {
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

      const stepperNode = document.getElementById('myStepper')
      const stepper = new Stepper(stepperNode, {
        animation: true
      })

      setTimeout(() => {
        expect(stepper.options).toEqual({
          linear: true,
          animation: true,
          selectors: {
            steps: '.step',
            trigger: '.step-trigger',
            stepper: '.bs-stepper'
          }
        })
        expect(document.querySelector('#test1').classList.contains('fade')).toBe(true)
        expect(document.querySelector('#test2').classList.contains('fade')).toBe(true)
        done()
      }, 10)
    })

    it('should add event listeners on triggers', () => {
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

      const trigger1 = document.querySelector('#trigger1')
      const trigger2 = document.querySelector('#trigger2')

      spyOn(trigger1, 'addEventListener')
      spyOn(trigger2, 'addEventListener')

      const stepperNode = document.getElementById('myStepper')
      const stepper = new Stepper(stepperNode)

      expect(trigger1.addEventListener).toHaveBeenCalled()
      expect(trigger2.addEventListener).toHaveBeenCalled()
      expect(stepperNode['bsStepper']).toEqual(stepper)
    })

    it('should allow css selector configuration', () => {
      fixture.innerHTML = [
        '<div id="myStepper" class="custom-bs-stepper">',
        '  <div class="custom-step" data-target="#test1">',
        '    <button id="trigger1" class="custom-step-trigger">1</button>',
        '  </div>',
        '  <div class="custom-step" data-target="#test2">',
        '    <button id="trigger2" class="custom-step-trigger">2</button>',
        '  </div>',
        '  <div id="test1">1</div>',
        '  <div id="test2">2</div>',
        '</div>'
      ].join('')

      const stepperNode = document.getElementById('myStepper')
      const stepper = new Stepper(stepperNode, {
        selectors: {
          steps: '.custom-step',
          trigger: '.custom-step-trigger',
          stepper: '.custom-bs-stepper'
        }
      })

      expect(stepper.options).toEqual({
        linear: true,
        animation: false,
        selectors: {
          steps: '.custom-step',
          trigger: '.custom-step-trigger',
          stepper: '.custom-bs-stepper'
        }
      })
    })
  })

  describe('next', () => {
    it('should go to the next step', done => {
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

      const stepperNode = document.getElementById('myStepper')
      const stepper = new Stepper(stepperNode)

      stepperNode.addEventListener('show.bs-stepper', function (event) {
        expect(event.detail.indexStep).toEqual(1)
        expect(event.detail.to).toEqual(1)
        expect(event.detail.from).toEqual(0)
      })
      stepperNode.addEventListener('shown.bs-stepper', function (event) {
        expect(event.detail.indexStep).toEqual(1)
        expect(event.detail.to).toEqual(1)
        expect(event.detail.from).toEqual(0)
        expect(document.querySelector('#test1').classList.contains('active')).toBe(false)
        expect(document.querySelector('#test2').classList.contains('active')).toBe(true)
        done()
      })

      stepper.next()
    })

    it('should go to the next step with css selector configuration', done => {
      fixture.innerHTML = [
        '<div id="myStepper" class="custom-bs-stepper">',
        '  <div class="custom-step" data-target="#test1">',
        '    <button id="trigger1" class="custom-step-trigger">1</button>',
        '  </div>',
        '  <div class="custom-step" data-target="#test2">',
        '    <button id="trigger2" class="custom-step-trigger">2</button>',
        '  </div>',
        '  <div id="test1">1</div>',
        '  <div id="test2">2</div>',
        '</div>'
      ].join('')

      const stepperNode = document.getElementById('myStepper')
      const stepper = new Stepper(stepperNode, {
        selectors: {
          steps: '.custom-step',
          trigger: '.custom-step-trigger',
          stepper: '.custom-bs-stepper'
        }
      })

      expect(stepper.options).toEqual({
        linear: true,
        animation: false,
        selectors: {
          steps: '.custom-step',
          trigger: '.custom-step-trigger',
          stepper: '.custom-bs-stepper'
        }
      })

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

    it('should not go to the next step if the show event is default prevented', done => {
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

      const stepperNode = document.getElementById('myStepper')
      const stepper = new Stepper(stepperNode)
      const listeners = {
        show (event) {
          event.preventDefault()
          expect(event.detail.indexStep).toEqual(1)

          setTimeout(() => {
            expect(listeners.shown).not.toHaveBeenCalled()
            expect(stepper._currentIndex).toEqual(0)
            done()
          }, 10)
        },
        shown () {
          console.warn('shown called but it should not be the case')
        }
      }

      spyOn(listeners, 'shown')

      stepperNode.addEventListener('show.bs-stepper', listeners.show)
      stepperNode.addEventListener('shown.bs-stepper', listeners.shown)

      stepper.next()
    })

    it('should stay at the end if we call next', () => {
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

      const stepperNode = document.getElementById('myStepper')
      const stepper = new Stepper(stepperNode)

      stepper.next()
      stepper.next()

      expect(document.querySelector('#test1').classList.contains('active')).toBe(false)
      expect(document.querySelector('#test2').classList.contains('active')).toBe(true)
    })

    it('should keep block class on previous steps for vertical stepper without fade', () => {
      fixture.innerHTML = [
        '<div id="myStepper" class="bs-stepper vertical">',
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

      const stepperNode = document.getElementById('myStepper')
      const stepper = new Stepper(stepperNode)

      stepper.next()

      expect(document.querySelector('#test2').classList.contains('active')).toBe(true)
      expect(document.querySelector('#test2').classList.contains('dstepper-block')).toBe(true)
    })
  })

  describe('previous', () => {
    it('should return to the previous step', done => {
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

      const stepperNode = document.getElementById('myStepper')
      const stepper = new Stepper(stepperNode)
      const test1 = document.querySelector('#test1')
      const test2 = document.querySelector('#test2')

      stepper.next()

      expect(test1.classList.contains('active')).toBe(false)
      expect(test2.classList.contains('active')).toBe(true)

      stepperNode.addEventListener('show.bs-stepper', function (event) {
        expect(event.detail.indexStep).toEqual(0)
        expect(event.detail.to).toEqual(0)
        expect(event.detail.from).toEqual(1)
      })

      stepperNode.addEventListener('shown.bs-stepper', function (event) {
        expect(event.detail.indexStep).toEqual(0)
        expect(event.detail.to).toEqual(0)
        expect(event.detail.from).toEqual(1)
        expect(test1.classList.contains('active')).toBe(true)
        expect(test2.classList.contains('active')).toBe(false)
        done()
      })

      stepper.previous()
    })

    it('should stay at the first step if previous called', () => {
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

      const test1 = document.querySelector('#test1')
      const test2 = document.querySelector('#test2')

      const stepperNode = document.getElementById('myStepper')
      const stepper = new Stepper(stepperNode)

      stepper.previous()

      expect(test1.classList.contains('active')).toBe(true)
      expect(test2.classList.contains('active')).toBe(false)
    })
  })

  describe('to', () => {
    it('should go to the step number', done => {
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

      const stepperNode = document.getElementById('myStepper')
      const stepper = new Stepper(stepperNode)
      const test1 = document.querySelector('#test1')
      const test2 = document.querySelector('#test2')

      stepperNode.addEventListener('show.bs-stepper', event => {
        expect(event.detail.indexStep).toEqual(1)
        expect(event.detail.to).toEqual(1)
        expect(event.detail.from).toEqual(0)
      })

      stepperNode.addEventListener('shown.bs-stepper', event => {
        expect(event.detail.indexStep).toEqual(1)
        expect(event.detail.to).toEqual(1)
        expect(event.detail.from).toEqual(0)
        expect(test1.classList.contains('active')).toBe(false)
        expect(test2.classList.contains('active')).toBe(true)
        done()
      })

      stepper.to(2)
    })

    it('should handle wrong inputs', () => {
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

      const stepperNode = document.getElementById('myStepper')
      const stepper = new Stepper(stepperNode)
      const test1 = document.querySelector('#test1')
      const test2 = document.querySelector('#test2')
      const test3 = document.querySelector('#test3')

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

  describe('reset', () => {
    it('should return to the first step', () => {
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

      const stepperNode = document.getElementById('myStepper')
      const stepper = new Stepper(stepperNode)
      const test1 = document.querySelector('#test1')
      const test2 = document.querySelector('#test2')

      stepper.next()

      expect(test1.classList.contains('active')).toBe(false)
      expect(test2.classList.contains('active')).toBe(true)

      stepper.reset()

      expect(test1.classList.contains('active')).toBe(true)
      expect(test2.classList.contains('active')).toBe(false)
    })
  })

  describe('destroy', () => {
    it('should clear properties', () => {
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

      const stepperNode = document.getElementById('myStepper')
      const stepper = new Stepper(stepperNode)

      expect(stepperNode['bsStepper']).toEqual(stepper)
      expect(stepper._element).toEqual(stepperNode)
      expect(stepper._currentIndex).toEqual(0)
      expect(stepper._steps.length).toEqual(2)
      expect(stepper._stepsContents.length).toEqual(2)
      expect(stepper._clickStepLinearListener).toBeTruthy()
      expect(stepper._clickStepNonLinearListener).toBeUndefined()

      stepper.destroy()

      expect(stepperNode.bsStepper).toBeUndefined()
      expect(stepper._element).toBeUndefined()
      expect(stepper._currentIndex).toBeUndefined()
      expect(stepper._steps).toBeUndefined()
      expect(stepper._stepsContents).toBeUndefined()
      expect(stepper._clickStepLinearListener).toBeUndefined()
      expect(stepper._clickStepNonLinearListener).toBeUndefined()
    })

    it('should remove event listeners on triggers', () => {
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

      const stepperNode = document.getElementById('myStepper')
      const stepper = new Stepper(stepperNode, { linear: false })

      const trigger1 = document.querySelector('#trigger1')
      const trigger2 = document.querySelector('#trigger2')

      spyOn(trigger1, 'removeEventListener')
      spyOn(trigger2, 'removeEventListener')

      stepper.destroy()

      expect(trigger1.removeEventListener).toHaveBeenCalled()
      expect(trigger2.removeEventListener).toHaveBeenCalled()
    })
  })
})
