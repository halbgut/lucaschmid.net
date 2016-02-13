const xhr = require('./xhr')
const websocket = require('./websocket')

var ws

const wsApiReq = (url, socket) => new Promise((res, rej) => {
  const respond = e => {
    socket.removeEventListener('message', respond)
    res(JSON.parse(e.data))
  }
  socket.addEventListener('message', respond)
  socket.send(url)
})

module.exports = (api, method) => new Promise((res, rej) => {
  if (!ws) {
    websocket()
      .then(newSocket => {
        ws = newSocket
        wsApiReq(`/api/${api}/ws/${method}`, ws)
          .then(res)
          .catch(rej)
      })
      .catch(e => {
        xhr(`/api/${api}/xhr/${method}`)
          .then(data => res(JSON.parse(data)))
          .catch(rej)
      })
  } else {
    wsApiReq(`/api/${api}/ws/${method}`, ws)
      .then(res)
      .catch(rej)
  }
})

