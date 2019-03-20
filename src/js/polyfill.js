let matches = window.Element.prototype.matches
let closest = (element, selector) => element.closest(selector)
let WinEvent = (inType, params) => new window.Event(inType, params)
let createCustomEvent = (eventName, params) => {
  const cEvent = new window.CustomEvent(eventName, params)

  return cEvent
}

/* istanbul ignore next */
function polyfill () {
  if (!window.Element.prototype.matches) {
    matches = window.Element.prototype.msMatchesSelector ||
      window.Element.prototype.webkitMatchesSelector
  }

  if (!window.Element.prototype.closest) {
    closest = (element, selector) => {
      if (!document.documentElement.contains(element)) {
        return null
      }

      do {
        if (matches.call(element, selector)) {
          return element
        }

        element = element.parentElement || element.parentNode
      } while (element !== null && element.nodeType === 1)

      return null
    }
  }

  if (!window.Event || typeof window.Event !== 'function') {
    WinEvent = (inType, params) => {
      params = params || {}
      const e = document.createEvent('Event')
      e.initEvent(inType, Boolean(params.bubbles), Boolean(params.cancelable))
      return e
    }
  }

  if (typeof window.CustomEvent !== 'function') {
    const originPreventDefault = window.Event.prototype.preventDefault

    createCustomEvent = (eventName, params) => {
      const evt = document.createEvent('CustomEvent')

      params = params || { bubbles: false, cancelable: false, detail: null }
      evt.initCustomEvent(eventName, params.bubbles, params.cancelable, params.detail)
      evt.preventDefault = function () {
        if (!this.cancelable) {
          return
        }

        originPreventDefault.call(this)
        Object.defineProperty(this, 'defaultPrevented', {
          get: function () { return true }
        })
      }

      return evt
    }
  }
}

polyfill()

export {
  closest,
  WinEvent,
  createCustomEvent
}
