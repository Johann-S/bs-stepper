# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.7.0](https://github.com/Johann-S/bs-stepper/compare/v1.6.1...v1.7.0) (2019-07-24)


### Bug Fixes

* **tests:** undefined event var ([ba557a2](https://github.com/Johann-S/bs-stepper/commit/ba557a2))
* **vertical:** weird behavior without fade ([3684792](https://github.com/Johann-S/bs-stepper/commit/3684792))


### Features

* **events:** add from and to properties in detail ([16b146a](https://github.com/Johann-S/bs-stepper/commit/16b146a))



### [1.6.1](https://github.com/Johann-S/bs-stepper/compare/v1.6.0...v1.6.1) (2019-06-19)


### Bug Fixes

* **docs:** update docs about config default values ([e545b03](https://github.com/Johann-S/bs-stepper/commit/e545b03))



## [1.6.0](https://github.com/Johann-S/bs-stepper/compare/v1.5.0...v1.6.0) (2019-06-19)


### Bug Fixes

* **core:** add unit test with custom selectors ([af31361](https://github.com/Johann-S/bs-stepper/commit/af31361))
* **events:** do not modified current step if events are prevented ([5cd49d3](https://github.com/Johann-S/bs-stepper/commit/5cd49d3))
* **typing:** improve typescript typing ([ae2f687](https://github.com/Johann-S/bs-stepper/commit/ae2f687))


### Features

* **core:** allow to customize stepper internal css classes  ([#28](https://github.com/Johann-S/bs-stepper/issues/28)) ([b39db02](https://github.com/Johann-S/bs-stepper/commit/b39db02))
* **docs:** add a link to the change log ([7215d95](https://github.com/Johann-S/bs-stepper/commit/7215d95))



# [1.5.0](https://github.com/Johann-S/bs-stepper/compare/v1.4.1...v1.5.0) (2019-03-22)


### Features

* **events:** dispatch show events (show and shown) ([8b49845](https://github.com/Johann-S/bs-stepper/commit/8b49845))



## [1.4.1](https://github.com/Johann-S/bs-stepper/compare/v1.4.0...v1.4.1) (2019-03-18)


### Bug Fixes

* **selector:** remove a selector ([e80d3e3](https://github.com/Johann-S/bs-stepper/commit/e80d3e3))


### BREAKING CHANGES

* **selector:** simple <a> tags won't trigger step change, you have to
use .step-trigger to allow that



# [1.4.0](https://github.com/Johann-S/bs-stepper/compare/v1.3.0...v1.4.0) (2019-02-26)


### Bug Fixes

* **build:** bump css too ([c135bd5](https://github.com/Johann-S/bs-stepper/commit/c135bd5))
* **build:** do not try to add dist during the process ([c89e165](https://github.com/Johann-S/bs-stepper/commit/c89e165))
* **core:** adjust css for retro compatibility ([0402870](https://github.com/Johann-S/bs-stepper/commit/0402870))
* **html:** remove btn class which isn't needed ([b46e048](https://github.com/Johann-S/bs-stepper/commit/b46e048))
* **linear:** fade effet wasn't applied ([5c6ce96](https://github.com/Johann-S/bs-stepper/commit/5c6ce96))
* **to:** should handle higher value ([55bcb2a](https://github.com/Johann-S/bs-stepper/commit/55bcb2a))


### Features

* **build:** improve banners ([6021e03](https://github.com/Johann-S/bs-stepper/commit/6021e03))
* **build:** improve build process ([75c62ca](https://github.com/Johann-S/bs-stepper/commit/75c62ca))
* **core:** rewrite css smartly ([30d895c](https://github.com/Johann-S/bs-stepper/commit/30d895c))
* **to:** add a method to navigate to a specific step ([f7e1add](https://github.com/Johann-S/bs-stepper/commit/f7e1add))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/Johann-S/bs-stepper/compare/v1.2.1...v1.3.0) (2018-10-29)


### Bug Fixes

* **accessibility:** replace aria-current by aria-selected following the application of aria tab pattern ([353791b](https://github.com/Johann-S/bs-stepper/commit/353791b))
* **accessibility:** use aria attributes, and change links by buttons ([4de6e32](https://github.com/Johann-S/bs-stepper/commit/4de6e32))
* **button:** add padding and cursor ([f197040](https://github.com/Johann-S/bs-stepper/commit/f197040))
* **docs:** align previous button with submit ([6ff73dd](https://github.com/Johann-S/bs-stepper/commit/6ff73dd))
* **docs:** better order for next/previous buttons ([cd74f77](https://github.com/Johann-S/bs-stepper/commit/cd74f77))
* **step:** remove step padding ([ea048f0](https://github.com/Johann-S/bs-stepper/commit/ea048f0))
* **testing:** unit tests ([65f43dd](https://github.com/Johann-S/bs-stepper/commit/65f43dd))
* **unit-tests:** add the required trigger id ([10fed58](https://github.com/Johann-S/bs-stepper/commit/10fed58))


### Features

* **core:** add unit tests ([514dc5e](https://github.com/Johann-S/bs-stepper/commit/514dc5e))
* **docs:** add aria tabs pattern for accessibility improvement ([ff6ed4b](https://github.com/Johann-S/bs-stepper/commit/ff6ed4b))
* **test:** add a unit test to be sure it works with <a> tags as trigger ([01bb8b8](https://github.com/Johann-S/bs-stepper/commit/01bb8b8))
* **testing:** add browserstack for cross browser testing ([78c3e8b](https://github.com/Johann-S/bs-stepper/commit/78c3e8b))
* **triggers:** allow other elements than <a> and <button> ([8d646aa](https://github.com/Johann-S/bs-stepper/commit/8d646aa))



<a name="1.2.1"></a>
## 1.2.1 (2018-10-22)


### Bug Fixes

* **css:** use visibility instead of opacity ([ddd53f2](https://github.com/Johann-S/bs-stepper/commit/ddd53f2))



<a name="1.2.0"></a>
# 1.2.0 (2018-10-21)


### Bug Fixes

* **index:** remove listeners for linear stepper too ([7a7862d](https://github.com/Johann-S/bs-stepper/commit/7a7862d))


### Features

* **core:** add vertical stepper ([eca853a](https://github.com/Johann-S/bs-stepper/commit/eca853a))
* **index:** add reset method for linear stepper ([a056adc](https://github.com/Johann-S/bs-stepper/commit/a056adc))



<a name="1.1.1"></a>
## 1.1.1 (2018-10-15)


### Bug Fixes

* **typing:** missing animation option ([806d2c1](https://github.com/Johann-S/bs-stepper/commit/806d2c1))



<a name="1.1.0"></a>
# 1.1.0 (2018-10-15)


### Bug Fixes

* **fade:** add d-none by default for fade steppers ([cb4a14d](https://github.com/Johann-S/bs-stepper/commit/cb4a14d))
* **fade:** use an option to enable/disable ([bd94d50](https://github.com/Johann-S/bs-stepper/commit/bd94d50))
* **typing:** make stepper option optional ([c10ced0](https://github.com/Johann-S/bs-stepper/commit/c10ced0))


### Features

* **core:** add fade effect ([09e5912](https://github.com/Johann-S/bs-stepper/commit/09e5912))



<a name="1.0.0"></a>
# 1.0.0 (2018-10-12)

### Features

* **core:** Linear stepper
* **core:** Non linear stepper
