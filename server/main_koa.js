const Handlebars = require('handlebars')
const WebSocket = require('websocket')
const http = require('http')

const koa = require('koa')
const koaStatic = require('koa-static')
const koaMorgan = require('koa-morgan')
const koaCompress = require('koa-compress')

const websocketHandler = require('./lib/websocketHandler')
const initTLS = require('./lib/tls')

// Set NODE_ENV
const NODE_ENV = process.env.NODE_ENV || 'development'

// Initialize app
const app = koa()

// Save the http server inside a const in order to use it later for the wss
const server = http.createServer(koa.callback()).listen(ports[0])

// Set the ports TODO: move this to the config somehow
const ports = NODE_ENV === 'production'
  ? [80, 443]
  : [3000, 3001]

// Static files
app.use(koaStatic(`${__dirname}/../client`))
app.use(koaStatic(`${__dirname}/../common`))

// Logging
app.use(koaMorgan('combined'))

// compression
app.use(koaCompress())

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

