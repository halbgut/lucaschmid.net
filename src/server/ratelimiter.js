module.exports = (() => {
  var count = 0
  setInterval(() => count = 0, 86400000) // Reset the counter evey 24 hours

  return {
    get: () => count,
    inc () { count++ },
    dec () { count-- }
  }
})

