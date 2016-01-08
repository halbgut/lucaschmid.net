module.exports = promises => new Promise((res, rej) => {
  var results = []
  promises.map((fn) => typeof fn === 'function'
    ? fn()
    : fn
      .then((data) => {
        results.push(data)
        if(results.length === promises.length) {
          res(results)
        }
      })
      .catch(rej)
  )
})

