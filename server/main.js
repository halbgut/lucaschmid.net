'use strict'

const WebSocket = require('websocket')
const WebSocketServer = WebSocket.server
const http = require('http')

const koa = require('koa')
const koaStatic = require('koa-static')
const mount = require('koa-mount')
const morgan = require('koa-morgan')
const compress = require('koa-compress')
const etag = require('koa-etag')
const fresh = require('koa-fresh')
const bodyParser = require('koa-bodyparser')

const redirects = require('./redirects')
const websocketHandler = require('./lib/websocketHandler')
const initTLS = require('./lib/tls')
const security = require('./lib/security')
const routes = require('./lib/routes')()
const restart = require('./lib/restart')
const config = require('../common/config.js')

// Initialize app
const app = koa()

// Save the http server inside a const in order to use it later for the wss
const server = http.createServer(app.callback()).listen(config.ports[0])

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
app.use(restart)

// Static files
app.use(koaStatic(`${__dirname}/../client`))
app.use(koaStatic(`${__dirname}/../common`))

// TLS redirect
let tls = false
app.use(redirects)
app.use(function * (next) {
  if (tls && !this.request.secure) {
    this.set('Location', `${config.defaultProto}://${config.hostname}${this.request.url}`)
    this.status = 302
  } else {
    yield next
  }
})

require(`${__dirname}/../subsites/elm-intro/server/main.js`)(app, '/elm')
app.use(koaStatic(`${__dirname}/../elm-intro/client/assets`))
app.use(mount('/vim-shortcut-viewer', koaStatic(`${__dirname}/../subsites/vim-shortcut-viewer`)))
app.use(mount('/elm-pomodoro', koaStatic(`${__dirname}/../subsites/elm-pomodoro`)))
app.use(mount('/minimum-viable-modern-javascript', koaStatic(`${__dirname}/../subsites/minimum-viable-modern-javascript/dist`)))
app.use(mount('/curriculum-vitae', koaStatic(`${__dirname}/../subsites/curriculum-vitae/dist`)))

// Add router
app.use(routes.routes())
app.use(routes.allowedMethods())

// Initialize ws://
new WebSocketServer({ httpServer: server })
  .on('request', websocketHandler.onSocketReq)
  .on('connect', websocketHandler.onSocketConn)

// Mount the TLS-Server and the wss://
initTLS('./tls/key.pem', './tls/cert.pem', app.callback(), config.ports[1])
  .then((tlsServer) => {
    tls = true
    new WebSocketServer({ httpServer: tlsServer })
      .on('request', websocketHandler.onSocketReq)
      .on('connect', websocketHandler.onSocketConn)
  })
  .catch(() => console.log('Server started without TLS'))

