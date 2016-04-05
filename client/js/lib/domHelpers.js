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

module.exports = {
  getTopOffset,
  updateHash,
  setHashFrags,
  setHashFrag,
  getHashFrags,
  getHashFrag
}

