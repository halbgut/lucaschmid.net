var fs = require('fs')
var https = require('https')

module.exports = (keyPath, certPath, app, port) => {
  return new Promise((res, rej) => {
    var key
    var cert

    fs.readFile(keyPath, (err, data) => {
      if(err) return rej(err)
      key = data
      if(cert) res(initTLS(key, cert, app, port))
    })

    fs.readFile(certPath, (err, data) => {
      if(err) return rej(err)
      cert = data
      if(key) res(initTLS(key, cert, app, port))
    })
  })
}

function initTLS (key, cert, app, port) {
  return https.createServer({key, cert}, app).listen(port)
}

