module.exports = promises => new Promise((res, rej) => {
  var results = []
  var inc = 0
  promises.map((fn, i) => typeof fn === 'function'
    ? fn()
    : fn
      .then((data) => {
        results[i] = data
        ++inc
        if(inc === promises.length) {
          res(results)
        }
      })
      .catch(rej)
  )
})

