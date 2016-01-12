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
const routes = require('./lib/routes')()

// Set NODE_ENV
const NODE_ENV = process.env.NODE_ENV || 'development'

// Initialize app
const app = koa()

// Set the ports TODO: move this to the config somehow
const ports = NODE_ENV === 'production'
  ? [80, 443]
  : [3000, 3001]

// Save the http server inside a const in order to use it later for the wss
const server = http.createServer(app.callback()).listen(ports[0])

// add etag support
app.use(fresh())
app.use(etag())

// Static files
app.use(koaStatic(`${__dirname}/../client`))
app.use(koaStatic(`${__dirname}/../common`))

// Logging
app.use(morgan.middleware('combined'))

// compression
app.use(compress())

// Add router
app.use(routes.routes())
app.use(routes.allowedMethods())

initTLS('./tls/key.pem', './tls/cert.pem', app.callback(), ports[1])
  .then((tlsServer) => {
    new WebSocket.server({ httpServer: tlsServer })
      .on('request', websocketHandler.onSocketReq)
      .on('connect', websocketHandler.onSocketConn)
  })
  .catch(() => {
    new WebSocket.server({ httpServer: server })
      .on('request', websocketHandler.onSocketReq)
      .on('connect', websocketHandler.onSocketConn)
  })

