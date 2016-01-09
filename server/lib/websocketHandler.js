const ratelimiter = require(`./ratelimiter`)()

var api = {}
api.github = require(`./github`)

function apiFn (path) {
  return path
    .split('/')
    .slice(1)
    .reduce((mem, val) => {
      if (val === 'private') return null
      if (typeof mem === 'function') return mem.bind(val)
      return mem && mem[val]
        ? mem[val]
        : null
    }, api)
}

module.exports = {
  onSocketReq (req) {
    req.accept(null, null)
  },

  onSocketConn (socket) {
    ratelimiter.inc()
    if (ratelimiter.get() >= 100) {
      socket.close(1000, 'Sorry, I\'m over capacity.')
      return
    }
    socket.on('close', ratelimiter.dec)
    socket.on('message', (msg) => {
      var fn
      if (msg.type !== 'utf8') return
      fn = apiFn(msg.utf8Data.substring(1))
      if (fn) {
        fn(socket)
      } else {
        socket.close(1007, 'API method not defined')
      }
    })
  }
}

