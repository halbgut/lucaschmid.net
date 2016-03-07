// const _ = require('lodash')

// const enc = window.encodeURIComponent
// const encodeObj = obj =>
//   _.chain(obj)
//     .map((v, k) => `${enc(k)}=${enc(v)}`)
//     .join('&')

const xhr = url => new Promise((res, rej) => {
  const req = new window.XMLHttpRequest()
  req.addEventListener('load', e => res(req.responseText))
  req.addEventListener('error', e => rej(e))
  req.open('GET', url)
  req.send()
})

xhr.post = (url, data) => new Promise((res, rej) => {
  const req = new window.XMLHttpRequest()
  req.addEventListener('load', e => res(req.responseText))
  req.addEventListener('error', e => rej(e))
  req.open('POST', url)
  req.setRequestHeader('Content-Type', 'application/json')
  req.send(JSON.stringify(data))
})

module.exports = xhr
