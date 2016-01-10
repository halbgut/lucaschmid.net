const github = require('./lib/github')
const view = require('./lib/view')

var feeds

require('./lib/feeds')
  .then(res => feeds = res)

module.exports = {
  '/api/github/xhr/{command}': (request, reply) => {
    if (github.xhr[request.params.command]) {
      github.xhr[request.params.command](reply)
        .then(response => {
          response.type('application/javascript')
        })
        .catch(err => reply(err))
    } else {
      reply.continue()
    }
  },
  '/api/view/xhr/{name}': (request, reply) => {
    view.xhr(request.params.name, request, reply)
      .then(js => {
        const response = reply(js)
        response.type('text/plain')
      })
      .catch(e => console.error(e) && reply.continue())
  },
  '/feed/{type}.xml': (request, reply) => {
    if (request.params.type === 'atom') return reply(feeds[0])
    if (request.params.type === 'rss') return reply(feeds[1])
    reply.continue()
  },
  '/{p*}': (request, reply) => {
    const response = reply.view('404')
    response.type('text/html')
    response.code(404)
  }
}

