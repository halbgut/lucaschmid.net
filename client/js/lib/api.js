const xhr = require('./xhr.js')
const websocket = require('./websocket.js')

var ws

const wsApiReq = (url, socket) => new Promise((resolve, reject) => {
  const respond = (e) => {
    socket.removeEventListener('message', respond)
    resolve(JSON.parse(e.data))
  }
  socket.addEventListener('message', respond)
  socket.send(url)
})

module.exports = (api, method) => new Promise((resolve, reject) => {
  if (!ws) {
    websocket()
      .then((newSocket) => {
        ws = newSocket
        wsApiReq(`/api/${api}/ws/${method}`, ws)
          .then(resolve)
          .catch(reject)
      })
      .catch((e) => {
        xhr(`/api/${api}/xhr/${method}`)
          .then((data) => resolve(JSON.parse(data)))
          .catch(reject)
      })
  } else {
    wsApiReq(`/api/${api}/ws/${method}`, ws)
      .then(resolve)
      .catch(reject)
  }
})

