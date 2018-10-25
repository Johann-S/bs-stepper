let matches = window.Element.prototype.matches
let closest = (element, selector) => element.closest(selector)
let WinEvent = (inType, params) => new window.Event(inType, params)

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
}

polyfill()

export {
  closest,
  WinEvent
}
