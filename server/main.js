'use strict'

const WebSocket = require('websocket')
const http = require('http')

const koa = require('koa')
const koaStatic = require('koa-static')
const morgan = require('koa-morgan')
const compress = require('koa-compress')
const etag = require('koa-etag')
const fresh = require('koa-fresh')

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

try {
  const elmIntroRoot = '/var/elm-intro'
  const elmIntro = require(`${elmIntroRoot}/server/main.js`)
  elmIntro(app, '/elm')
  app.use(koaStatic(`${elmIntroRoot}/client/assets`))
} catch (e) {
  console.log('starting without elm intro')
}

// Add router
app.use(routes.routes())
app.use(routes.allowedMethods())

// Initialize ws://
new WebSocket.server({ httpServer: server })
  .on('request', websocketHandler.onSocketReq)
  .on('connect', websocketHandler.onSocketConn)

// Mount the TLS-Server and the wss://
initTLS('./tls/key.pem', './tls/cert.pem', app.callback(), ports[1])
  .then((tlsServer) => {
    tls = true
    new WebSocket.server({ httpServer: tlsServer })
      .on('request', websocketHandler.onSocketReq)
      .on('connect', websocketHandler.onSocketConn)
  })
  .catch(() => console.log('Server started without TLS'))

