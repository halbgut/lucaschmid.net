const github = require('./lib/github')

var feeds

require('./lib/feeds')
  .then(res => feeds = res)

module.exports = {
  '/api/github/{command}': (request, reply) => {
    github[request.params.command]
      ? github[request.params.command](reply)
      : reply.continue()
  },
  '/feed/{type}.xml': (request, reply) => {
    if (request.params.type === 'atom') return reply(feeds[0])
    if (request.params.type === 'rss') return reply(feeds[1])
    reply.continue()
  }
}

