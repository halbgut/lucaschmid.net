var fs = require('fs')
var https = require('https')

module.exports = (keyPath, certPath, callback, port) => {
  return new Promise((res, rej) => {
    var key
    var cert

    fs.readFile(keyPath, (err, data) => {
      if (err) return rej(err)
      key = data
      if (cert) res(initTLS(key, cert, callback, port))
    })

    fs.readFile(certPath, (err, data) => {
      if (err) return rej(err)
      cert = data
      if (key) res(initTLS(key, cert, callback, port))
    })
  })
}

function initTLS (key, cert, callback, port) {
  return https.createServer({key, cert}, callback).listen(port)
}

