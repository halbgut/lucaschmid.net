const getTopOffset = (el, prop = 'offsetTop', n = 0) => {
  if (!el.offsetParent) return n
  return getTopOffset(el.offsetParent, prop, n + el[prop])
}

const updateHash = (newHash) => {
  window.location = window.location.href.split('#')[0] + '#' + newHash
}

const getHashFrag = (n) =>
  getHashFrags()[n]

const setHashFrag = (n, v) => {
  const newFrags = getHashFrags()
  newFrags[n] = v
  return setHashFrags(newFrags)
}

const getHashFrags = () =>
  window.location.hash.substr(1).split('/').slice(1)

const setHashFrags = (frags) => {
  window.location = `${window.location.href.split('#')[0]}#/${frags.join('/')}`
  return window.location
}

const addScrollStopEvent = (el) => {
  let justScrolled = 0
  const scrollStop = new window.CustomEvent('scrollstop', {})
  el.addEventListener('scroll', () => {
    ++justScrolled
    window.setTimeout(() => {
      if (--justScrolled === 0) el.dispatchEvent(scrollStop)
    }, 100)
  })
}

const throttleAnimation = (fn) => {
  let resting = false
  return (...args) => {
    if (resting) return
    resting = true
    window.requestAnimationFrame(() => {
      fn(...args)
      resting = false
    })
  }
}

/**
 * Source for the next block:
 * https://gist.github.com/lorenzopolidori/3794226
 */
const has3d = () => {
  if (!window.getComputedStyle) {
    return false
  }
  const el = document.createElement('p')
  let has3d
  const transforms = {
    'webkitTransform': '-webkit-transform',
    'OTransform': '-o-transform',
    'msTransform': '-ms-transform',
    'MozTransform': '-moz-transform',
    'transform': 'transform'
  }
  // Add it to the body to get the computed style
  document.body.insertBefore(el, null)
  for (var t in transforms) {
    if (el.style[t] !== undefined) {
      el.style[t] = 'translate3d(1px,1px,1px)'
      has3d = window.getComputedStyle(el).getPropertyValue(transforms[t])
    }
  }
  document.body.removeChild(el)
  return (has3d !== undefined && has3d.length > 0 && has3d !== 'none')
}

module.exports = {
  getTopOffset,
  updateHash,
  setHashFrags,
  setHashFrag,
  getHashFrags,
  getHashFrag,
  addScrollStopEvent,
  throttleAnimation,
  has3d
}

