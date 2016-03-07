const isError = e => !(e.target.status >= 200 && e.target.status < 300 || e.target.status === 304)

const xhr = url => new Promise((res, rej) => {
  const req = new window.XMLHttpRequest()
  req.addEventListener('load', e => {
    if (isError(e)) return rej(e.responseText)
    res(req.responseText)
  })
  req.addEventListener('error', e => rej(e))
  req.open('GET', url)
  req.send()
})

xhr.post = (url, data) => new Promise((res, rej) => {
  const req = new window.XMLHttpRequest()
  req.addEventListener('load', e => {
    console.log(e.target)
    if (isError(e)) return rej(e.responseText)
    res(req.responseText)
  })
  req.addEventListener('error', e => rej(e))
  req.open('POST', url)
  req.setRequestHeader('Content-Type', 'application/json')
  req.send(JSON.stringify(data))
})

module.exports = xhr
