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

const queue = []
let lock = false
let ws = undefined
let wsSupport = true

const unlockAndCheck = (cb) =>
  (data) => {
    cb(data)
    lock = false
    checkQueue()
  }

const checkQueue = () => {
  if (lock || queue.length === 0) return
  const call = queue.shift()
  lock = true
  if (wsSupport && !ws) {
    websocket()
      .then((newSocket) => {
        ws = newSocket
        call[0]()
      })
      .catch((e) => {
        wsSupport = false
        call[1]()
      })
  } else if (ws) call[0]()
  else call[1]()
}

module.exports = (api, method) => new Promise((resolve, reject) => {
  const doXhrReq = () =>
    xhr(`/api/${api}/xhr/${method}`)
      .then(unlockAndCheck((data) =>
        resolve(JSON.parse(data))
      ))
      .catch(unlockAndCheck(reject))
  const doWsReq = () =>
    wsApiReq(`/api/${api}/ws/${method}`, ws)
      .then(unlockAndCheck(resolve))
      .catch(unlockAndCheck(reject))
  queue.push([doWsReq, doXhrReq])
  checkQueue()
})


