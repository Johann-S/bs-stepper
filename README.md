# bs-stepper

[![dependencies Status](https://img.shields.io/david/Johann-S/bs-stepper.svg)](https://david-dm.org/Johann-S/bs-stepper)
[![devDependencies Status](https://img.shields.io/david/dev/Johann-S/bs-stepper.svg)](https://david-dm.org/Johann-S/bs-stepper?type=dev)
[![Build Status](https://img.shields.io/travis/Johann-S/bs-stepper/master.svg)](https://travis-ci.org/Johann-S/bs-stepper)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com/)
[![JS gzip size](https://img.badgesize.io/Johann-S/bs-stepper/gh-pages/dist/js/bs-stepper.min.js?compression=gzip&label=JS+gzip+size)](https://github.com/Johann-S/bs-stepper/tree/gh-pages/dist/js/bs-stepper.min.js)
[![CSS gzip size](https://img.badgesize.io/Johann-S/bs-stepper/gh-pages/dist/css/bs-stepper.min.css?compression=gzip&label=CSS+gzip+size)](https://github.com/Johann-S/bs-stepper/tree/gh-pages/dist/css/bs-stepper.min.css)

A stepper plugin for Bootstrap 4.

You can use it on React and Angular too because this plugin is written with the most used JavaScript framework: [VanillaJS](http://vanilla-js.com/).

Features:

- Linear stepper
- Non linear stepper
- Works with Bootstrap 4
- Works without *dependencies* and **jQuery**
- Built in UMD to be used everywhere
- Small, only **2kb** and less if you gzip it

## Table of contents

- [Install](#install)
- [How to use it](#how-to-use-it)
- [Methods](#methods)
- [Support me](#support-me)
- [License](#license)

## Install

### With npm

```sh
npm install bs-stepper --save
```

### CDN

CDN | Link
------------ | -------------
unpkg | [`https://unpkg.com/bs-stepper`](https://unpkg.com/bs-stepper)
unpkg, js minified | [`https://unpkg.com/bs-stepper/dist/js/bs-stepper.min.js`](https://unpkg.com/bs-stepper/dist/js/bs-stepper.min.js)
unpkg, css minified | [`https://unpkg.com/bs-stepper/dist/css/bs-stepper.min.css`](https://unpkg.com/bs-stepper/dist/css/bs-stepper.min.css)

## How to use it

### HTML markup

Include the CSS file:

```html
<link rel="stylesheet" href="bs-stepper.min.css">
```

Add the following HTML:

```html
<div class="bs-stepper">
  <div class="bs-stepper-header">
    <!-- your steps here -->
    <div class="step" data-target="#logins-part">
      <a href="#">
        <span class="bs-stepper-circle">1</span>
        <span class="bs-stepper-label">Logins</span>
      </a>
    </div>
    <div class="line"></div>
    <div class="step" data-target="#information-part">
      <a href="#">
        <span class="bs-stepper-circle">2</span>
        <span class="bs-stepper-label">Various information</span>
      </a>
    </div>
  </div>
  <div class="bs-stepper-content">
    <!-- your steps content here -->
    <div id="logins-part" class="content"></div>
    <div id="information-part" class="content"></div>
  </div>
</div>
```

### JavaScript

In HTML before the end of the `<body>` tag

```html
<script src="bs-stepper.min.js"></script>
```

Or with npm

```js
import bsStepper from 'bs-stepper'
```

### Create a stepper

You should wait for the document ready event and create a new instance of `bsStepper`.

Vanilla JS

```js
document.addEventListener('DOMContentLoaded', function () {
  var stepper = new bsStepper(document.querySelector('.bs-stepper'))
})
```

With jQuery

```js
$(document).ready(function () {
  var stepper = new bsStepper($('.bs-stepper')[0])
})
```

For more examples check out [this file](https://github.com/Johann-S/bs-stepper/blob/master/tests/index.html).

This library is UMD ready so you can use it everywhere.

## Methods

## constructor

Create an instance of `bsStepper`, accept two parameters.

#### Parameters

- `element`
- type: `DOMElement`

Pass your `bsStepper` DOMElement

- `options`
  - default value: `{ linear: true }`
  - type: `Object`

  Allows you to choose if you want a linear stepper or not

### next

Will navigate to the next step of your stepper

```js
var stepper = new bsStepper(document.querySelector('.bs-stepper'))
stepper.next()
```

### destroy

Remove stored data relative to your stepper and listeners.

## Support me

If you want to thank me, you can support me and become my [Patron](https://www.patreon.com/jservoire)

## License

[MIT](https://github.com/Johann-S/bs-stepper/blob/master/LICENSE)
