const _ = require('lodash')
const Handlebars = require('handlebars')
const vision = require('vision')
const Inert = require('inert')
const hapi = require('hapi')

const staticRoutes = require('../common/routes')
const config = require('../common/config')

// Create a new server instance
const server = new hapi.Server({
  connections: { routes: { files: {
    relativeTo: `${__dirname}/../client/_build`
  } } }
})

// Register vision
server.register(vision, (err) => {
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

server.method(
  'cachedRender',
  (view, action, next) => server.render(view, _.extend(config, action()), next),
  {
    cache: { generateTimeout: 1000, expiresIn: 31536000000 },
    generateKey: (view, action) => view
  }
)

_.each(staticRoutes, (params, route) => {
  server.route({
    path: route,
    method: 'GET',
    handler: (request, reply) => {
      server.methods.cachedRender(params[0], params[1], (err, html) => {
        if (err) throw err
        reply(html)
      })
    }
  })
})

server.route({
  method: 'GET',
  path: '/{param*}',
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

server.start((err) => {
  if (err) throw err
  console.log(`Server was started on ${config.hostname}:${config.ports[0]} and ${config.hostname}:${config.ports[1]}`)
})

