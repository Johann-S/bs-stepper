var stepper1 = null
var stepper2 = null

document.addEventListener('DOMContentLoaded', function () {
  stepper1 = new bsStepper(document.querySelector('#stepper1'))
  stepper2 = new bsStepper(document.querySelector('#stepper2'), {
    linear: false
  })
})
