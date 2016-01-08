module.exports = fn => new Promise((res, rej) => {
  fn((err, data) => {
    if (err) return rej(err)
    res(data)
  })
})

