module.exports = url => new Promise((res, rej) => {
  const req = new window.XMLHttpRequest()
  req.addEventListener('load', e => res(req.responseText))
  req.addEventListener('error', e => rej(e))
  req.open('GET', url)
  req.send()
})

