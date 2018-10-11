let matches = window.Element.prototype.matches
let closest = (element, selector) => element.closest(selector)

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

export {
  closest
}
