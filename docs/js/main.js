var stepper1 = null
var stepper2 = null
var stepper3 = null
var stepper4 = null

document.addEventListener('DOMContentLoaded', function () {
  stepper1 = new Stepper(document.querySelector('#stepper1'))
  stepper2 = new Stepper(document.querySelector('#stepper2'), {
    linear: false
  })
  stepper3 = new Stepper(document.querySelector('#stepper3'), {
    linear: false,
    animation: true
  })
  stepper4 = new Stepper(document.querySelector('#stepper4'))

  function handleBreakPointChange (breakpoint) {
    if (breakpoint === 'large') {
      stepper1._element.classList.add('vertical')
      stepper2._element.classList.add('vertical')
      stepper3._element.classList.add('vertical')
    } else if (breakpoint === 'xLarge' && stepper1._element.classList.contains('vertical')) {
      stepper1._element.classList.remove('vertical')
      stepper2._element.classList.remove('vertical')
      stepper3._element.classList.remove('vertical')
    }
  }

  window.addEventListener('new.bs.breakpoint', function (event) {
    handleBreakPointChange(event.detail)
  })

  bsBreakpoints.init()
  handleBreakPointChange(bsBreakpoints.detectBreakpoint())
})
