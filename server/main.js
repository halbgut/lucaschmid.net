const _ = require('lodash')
const Handlebars = require('handlebars')
const WebSocket = require('websocket')

const Vision = require('vision')
const Inert = require('inert')
const Hapi = require('hapi')

const dynRoutes = require('./routes')
const websocketHandler = require('./lib/websocketHandler')
const staticRoutes = require('../common/routes')
const config = require('../common/config')

// CreaTe a new server instance
const server = new Hapi.Server({
  connections: { routes: { files: {
    relativeTo: `${__dirname}/../client/_build`
  } } }
})

// Register vision
server.register(Vision, (err) => {
  if (err) throw err
  server.views({
    engines: { html: Handlebars },
    relativeTo: `${__dirname}/../common`,
    path: 'templates',
    helpersPath: 'helpers',
    layout: 'layout'
  })
})

// Register inert
server.register(Inert, () => {})

server.connection({
  host: config.hostname,
  port: config.ports[0]
})

// Add the cachedRender method
server.method(
  'cachedRender',
  (action, next) => {
    const res = action()
    res[1]()
      .then((data) => {
        server.render(res[0], _.extend(config, data), next)
      })
      .catch(err => {
        console.error(err)
        throw err
      })
  },
  {
    cache: { generateTimeout: 1000, expiresIn: 31536000000 },
    generateKey: action => {
      const res = action()
      return res[2] || res[0]
    }
  }
)

// Add WebSocket listeners
server.connections.forEach((connection) => {
  new WebSocket.server({ httpServer: connection.listener })
    .on('request', websocketHandler.onSocketReq)
    .on('connect', websocketHandler.onSocketConn)
})

_.each(dynRoutes, (action, route) => {
  server.route({
    path: route,
    method: 'GET',
    handler: action
  })
})

server.route({
  method: 'GET',
  path: '/client/{param*}',
  handler: { directory: {
    path: '.'
  } }
})

server.route({
  method: 'GET',
  path: '/common/{param*}',
  handler: { directory: {
    path: 'common'
  } }
})

_.each(staticRoutes, (action, route) => {
  server.route({
    path: route,
    method: 'GET',
    handler: (request, reply) => {
      server.methods.cachedRender(
        action.bind(null, request.params),
        (err, html) => {
          if (err) throw err
          const response = reply(html)
          response.type('text/html')
          response.code(404)
        }
      )
    }
  })
})

server.start((err) => {
  if (err) throw err
  console.log(`Server was started on ${config.hostname}:${config.ports[0]} and ${config.hostname}:${config.ports[1]}`)
})

