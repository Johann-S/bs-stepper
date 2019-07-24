# bs-stepper

[![npm version](https://img.shields.io/npm/v/bs-stepper.svg)](https://www.npmjs.com/package/bs-stepper)
[![dependencies Status](https://img.shields.io/david/Johann-S/bs-stepper.svg)](https://david-dm.org/Johann-S/bs-stepper)
[![devDependencies Status](https://img.shields.io/david/dev/Johann-S/bs-stepper.svg)](https://david-dm.org/Johann-S/bs-stepper?type=dev)
[![Build Status](https://img.shields.io/travis/Johann-S/bs-stepper/master.svg)](https://travis-ci.org/Johann-S/bs-stepper)
![Coveralls github branch](https://img.shields.io/coveralls/github/Johann-S/bs-stepper/master.svg)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com/)
[![JS gzip size](https://img.badgesize.io/Johann-S/bs-stepper/gh-pages/dist/js/bs-stepper.min.js?compression=gzip&label=JS+gzip+size)](https://github.com/Johann-S/bs-stepper/tree/gh-pages/dist/js/bs-stepper.min.js)
[![CSS gzip size](https://img.badgesize.io/Johann-S/bs-stepper/gh-pages/dist/css/bs-stepper.min.css?compression=gzip&label=CSS+gzip+size)](https://github.com/Johann-S/bs-stepper/tree/gh-pages/dist/css/bs-stepper.min.css)

A stepper plugin for Bootstrap 4.

You can use it on [React](https://stackblitz.com/edit/bs-stepper-react) and [Angular](https://stackblitz.com/edit/bs-stepper-angular) too because this plugin is written with the most used JavaScript framework: [VanillaJS](http://vanilla-js.com/).

[Demo](https://johann-s.github.io/bs-stepper/)

If you want to see our last changes it's here: [https://bs-stepper.netlify.com/](https://bs-stepper.netlify.com/)

Features:

- Linear stepper
- Non linear stepper
- Fade effect with `.fade`
- Vertical stepper
- Works with Bootstrap 4
- Accessible
- Works without *dependencies* (so no **jQuery** needed)
- Built in UMD to be used everywhere
- Small, only **2kb**

## Table of contents

- [Install](#install)
- [How to use it](#how-to-use-it)
- [Methods](#methods)
- [Events](#events)
- [Compatibility](#compatibility)
- [Support me](#support-me)
- [Thanks](#thanks)
- [License](#license)

## Install

### With npm or yarn

```sh
// npm
npm install bs-stepper --save

// yarn
yarn add bs-stepper
```

### CDN

CDN | Link
------------ | -------------
jsDelivr, js minified | [`https://cdn.jsdelivr.net/npm/bs-stepper/dist/js/bs-stepper.min.js`](https://cdn.jsdelivr.net/npm/bs-stepper/dist/js/bs-stepper.min.js)
jsDelivr, css minified | [`https://cdn.jsdelivr.net/npm/bs-stepper/dist/css/bs-stepper.min.css`](https://cdn.jsdelivr.net/npm/bs-stepper/dist/css/bs-stepper.min.css)

## How to use it

### HTML markup

Include the CSS file:

```html
<link rel="stylesheet" href="bs-stepper.min.css">
```

Add the following HTML:

```html
<div class="bs-stepper">
  <div class="bs-stepper-header" role="tablist">
    <!-- your steps here -->
    <div class="step" data-target="#logins-part">
      <button type="button" class="step-trigger" role="tab" aria-controls="logins-part" id="logins-part-trigger">
        <span class="bs-stepper-circle">1</span>
        <span class="bs-stepper-label">Logins</span>
      </button>
    </div>
    <div class="line"></div>
    <div class="step" data-target="#information-part">
      <button type="button" class="step-trigger" role="tab" aria-controls="information-part" id="information-part-trigger">
        <span class="bs-stepper-circle">2</span>
        <span class="bs-stepper-label">Various information</span>
      </button>
    </div>
  </div>
  <div class="bs-stepper-content">
    <!-- your steps content here -->
    <div id="logins-part" class="content" role="tabpanel" aria-labelledby="logins-part-trigger"></div>
    <div id="information-part" class="content" role="tabpanel" aria-labelledby="information-part-trigger"></div>
  </div>
</div>
```

- If you want to use the fade `fade` animation, add `.fade` class on your `.content` and set `animation` to `true`.
- To create a vertical stepper, just add `.vertical` class on your stepper. All steppers will switch to vertical on small viewports.

### JavaScript

In HTML before the end of the `<body>` tag

```html
<script src="bs-stepper.min.js"></script>
```

Or with npm

```js
import Stepper from 'bs-stepper'
```

### Create a stepper

You should wait for the document ready event and create a new instance of `Stepper`.

Vanilla JS

```js
document.addEventListener('DOMContentLoaded', function () {
  var stepper = new Stepper(document.querySelector('.bs-stepper'))
})
```

With jQuery

```js
$(document).ready(function () {
  var stepper = new Stepper($('.bs-stepper')[0])
})
```

For more examples check out [this file](https://github.com/Johann-S/bs-stepper/blob/master/tests/index.html).

This library is UMD ready so you can use it everywhere.

## Methods

### constructor

Create an instance of `Stepper`, accept two parameters.

#### Parameters

- `element`
- type: `DOMElement`

Pass your `Stepper` DOMElement

- `options` (optional)
  - type: `Object`

  default value:
  ```js
  {
    linear: true,
    animation: false,
    selectors: {
      steps: '.step',
      trigger: '.step-trigger',
      stepper: '.bs-stepper'
    }
  }
  ```

  Allows you to customize the stepper selectors and it's behaviour.

### next

Will navigate to the next step of your stepper. This method also emit `show.bs-stepper` before showing the step and
`shown.bs-stepper` when the step is displayed.

```js
var stepper = new Stepper(document.querySelector('.bs-stepper'))
stepper.next()
```

### previous

Will navigate to the previous step of your stepper. This method also emit `show.bs-stepper` before showing the step and
`shown.bs-stepper` when the step is displayed.

### to

Will navigate to a step of your stepper. This method also emit `show.bs-stepper` before showing the step and
`shown.bs-stepper` when the step is displayed.

```js
var stepper = new Stepper(document.querySelector('.bs-stepper'))

/// Will navigate to the second step
stepper.to(2)
```

### reset

Will reset you stepper to the first step (usefull for linear stepper). This method also emit `show.bs-stepper` before showing the step and
`shown.bs-stepper` when the step is displayed.

### destroy

Remove stored data relative to your stepper and listeners.

## Events

The methods which trigger a step change trigger two events:
 - `show.bs-stepper`
 - `shown.bs-stepper`

You can listen on those events like that:

```js
var stepperEl = document.getElementById('stepper')
var stepper = new Stepper(stepperEl)

stepperEl.addEventListener('show.bs-stepper', function (event) {
  // You can call prevent to stop the rendering of your step
  // event.preventDefault()

  console.warn(event.detail.indexStep)
})

stepperEl.addEventListener('shown.bs-stepper', function (event) {
  console.warn('step shown')
})
```

The event `detail` object contains the following properties:
```
{
  indexStep: contains the id of the step which will be displayed,
  to: alias of indexStep,
  from: previous step id (or current step id)
}
```

If you need to prevent the display of a step, you have to call `preventDefault` on the `show.bs-stepper` listener.

## Compatibility

bsStepper is compatible with:

- IE10+
- Edge
- Firefox
- Chrome
- Safari
- Chrome Android
- Safari iOS

You can find our BrowserStack list of browsers [here](https://github.com/Johann-S/bs-stepper/blob/master/tests/browsers.js).

## Support me

If you want to thank me or supporting my work:
 - You can become my [Patron](https://www.patreon.com/jservoire)
 - Or buy me a coffee: [PayPal](https://www.paypal.me/jservoire)

## Thanks

[![BrowserStack Logo](https://www.browserstack.com/images/mail/browserstack-logo-footer.png)](https://www.browserstack.com/)

Thanks to [BrowserStack](https://www.browserstack.com/) for providing the infrastructure that allows us to test in real browsers!

## License

[MIT](https://github.com/Johann-S/bs-stepper/blob/master/LICENSE)
