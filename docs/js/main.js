var stepper1 = null
var stepper2 = null

document.addEventListener('DOMContentLoaded', function () {
  stepper1 = new Stepper(document.querySelector('#stepper1'))
  stepper2 = new Stepper(document.querySelector('#stepper2'), {
    linear: false
  })
})
