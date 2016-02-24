'use strict'

const WebSocket = require('websocket')
const WebSocketServer = WebSocket.server
const http = require('http')
const crypto = require('crypto')
const fs = require('fs')
const scmp = require('scmp')

const koa = require('koa')
const koaStatic = require('koa-static')
const mount = require('koa-mount')
const morgan = require('koa-morgan')
const compress = require('koa-compress')
const etag = require('koa-etag')
const fresh = require('koa-fresh')
const bodyParser = require('koa-bodyparser')

const websocketHandler = require('./lib/websocketHandler')
const initTLS = require('./lib/tls')
const security = require('./lib/security')
const routes = require('./lib/routes')()
const config = require('../common/config.js')

// Initialize app
const app = koa()

// Set the ports TODO: move this to the config somehow
const ports = config.ports

// Save the http server inside a const in order to use it later for the wss
const server = http.createServer(app.callback()).listen(ports[0])

// Logging
app.use(morgan.middleware('combined'))

// add etag support
app.use(fresh())
app.use(etag())

// compression
app.use(compress())

// Mount the security headers
app.use(security)

// Parse POST body
app.use(bodyParser())

// Github `push` webhook
// This simple writes a file when the hook is called. The systemd-unit defined
// in lucaschmid.net.restart.service pulls the latest version from the github
// repo and restarts the docker container.
app.use(function *(next) {
  if (
    this.method === 'POST' &&
    this.url === '/restart'
  ) {
    const hmac = crypto.createHmac('sha1', config.restartKey)
    const hash = hmac.update(JSON.stringify(this.request.body))
    if (scmp('sha1=' + hash.digest('hex'), this.request.headers['x-hub-signature'])) {
      fs.writeFileSync('restart', '.')
      this.status = 200
      this.body = ''
    } else {
      yield next
    }
  } else {
    yield next
  }
})

// Static files
app.use(koaStatic(`${__dirname}/../client`))
app.use(koaStatic(`${__dirname}/../common`))

// TLS redirect
let tls = false
app.use(function *(next) {
  if (tls && !this.request.secure) {
    this.set('Location', `${config.defaultProto}://${config.hostname}${this.request.url}`)
    this.status = 302
  } else {
    yield next
  }
})

require('/var/elm-intro/server/main.js')(app, '/elm')
app.use(koaStatic('/var/elm-intro/client/assets'))
app.use(mount('/vim-shortcut-viewer', koaStatic('/var/vim-shortcut-viewer')))
app.use(mount('/elm-pomodoro', koaStatic('/var/elm-pomodoro')))

// Add router
app.use(routes.routes())
app.use(routes.allowedMethods())

// Initialize ws://
new WebSocketServer({ httpServer: server })
  .on('request', websocketHandler.onSocketReq)
  .on('connect', websocketHandler.onSocketConn)

// Mount the TLS-Server and the wss://
initTLS('./tls/key.pem', './tls/cert.pem', app.callback(), ports[1])
  .then((tlsServer) => {
    tls = true
    new WebSocketServer({ httpServer: tlsServer })
      .on('request', websocketHandler.onSocketReq)
      .on('connect', websocketHandler.onSocketConn)
  })
  .catch(() => console.log('Server started without TLS'))

