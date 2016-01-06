const handlebars = require('handlebars')
const vision = require('vision')
const hapi = require('hapi')

const staticRoutes = require('../common/routes')
const config = require('./config')

module.exports = () => {
  // Create a new server instance
  const server = new hapi.Server()

  // Register vision
  server.register(vision, (err) => {
    if (err) throw err
    server.views({
      engines: { html: handlebars },
      path: 'common/templates'
    })
  })

  server.connection({
    host: config.hostname,
    port: config.ports[0]
  })

  server.method('cachedRender')

  staticRoutes.forEach((action, route) => {
    server.get(route, (request, reply) => {
      action((view, param) => reply.view(view, param))
    })
  })

  server.start((err) => {
    if (err) throw err
    console.log(`Server was started on ${config.hostname}:${config.ports[0]} and ${config.hostname}:${config.ports[1]}`)
  })
}
