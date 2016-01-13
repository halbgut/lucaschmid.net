module.exports = {
  getTopOffset (el, prop = 'offsetTop', n = 0) {
    if (!el.offsetParent) return n
    return this.getTopOffset(el.offsetParent, prop, n + el[prop])
  }
}

