const isError = e => !(e.target.status >= 200 && e.target.status < 300 || e.target.status === 304)

const fail = e => {
  let err
  try {
    err = JSON.parse(e.target.responseText)
  } catch (e) {
    err = e
  }
  return err
}

const xhr = url => new Promise((res, rej) => {
  const req = new window.XMLHttpRequest()
  req.addEventListener('load', e => {
    if (isError(e)) return rej(fail(e))
    res(req.responseText)
  })
  req.addEventListener('error', e => rej(e))
  req.open('GET', url)
  req.send()
})

xhr.post = (url, data) => new Promise((res, rej) => {
  const req = new window.XMLHttpRequest()
  req.addEventListener('load', e => {
    if (isError(e)) return rej(fail(e))
    res(req.responseText)
  })
  req.addEventListener('error', e => rej(e))
  req.open('POST', url)
  req.setRequestHeader('Content-Type', 'application/json')
  req.send(JSON.stringify(data))
})

module.exports = xhr
