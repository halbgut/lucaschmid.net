module.exports = {
  getTopOffset (el, prop = 'offsetTop', n = 0) {
    if (!el.offsetParent) return n
    return this.getTopOffset(el.offsetParent, prop, n + el[prop])
  },
  updateHash (newHash) {
    window.location = window.location.href.split('#')[0] + '#' + newHash
  }
}

