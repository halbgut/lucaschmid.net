const xhr = require('./xhr.js')
const websocket = require('./websocket.js')

const wsApiReq = (url, socket) => new Promise((resolve, reject) => {
  const respond = (e) => {
    socket.removeEventListener('message', respond)
    resolve(JSON.parse(e.data))
  }
  socket.addEventListener('message', respond)
  socket.send(url)
})

module.exports = () =>
  (
    (queue, ws, wsSupport) =>
      (api, method) => new Promise((resolve, reject) => {
        const doXhrReq = () =>
          xhr(`/api/${api}/xhr/${method}`)
            .then((data) => resolve(JSON.parse(data)))
            .catch(reject)
        const doWsReq = () =>
          wsApiReq(`/api/${api}/ws/${method}`, ws)
            .then(resolve)
            .catch(reject)

        if (!ws) {
          websocket()
            .then((newSocket) => {
              ws = newSocket
              doWsReq()
            })
            .catch((e) => {
              wsSupport = false
              doXhrReq()
            })
        } else {
          doWsReq()
        }
      })
  )(false, undefined, true)

