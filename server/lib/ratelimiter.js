'use strict'

const ratelimiter = () => {
  var count = 0
  setInterval(() => count = 0, 86400000) // Reset the counter evey 24 hours

  return {
    get: () => count,
    inc () { count++ },
    dec () { count-- }
  }
}

ratelimiter.smart = (nps) => {
  let lastPing = 0
  return {
    ping: () => {
      lastPing = (new Date()).getTime()
    },
    canDo: () => ((new Date()).getTime() - lastPing) / 1000 > nps,
    reset: () => lastPing = 0
  }
}

module.exports = ratelimiter

