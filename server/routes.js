const github = require('./lib/github')

module.exports = {
  '/api/github/{command}': (request, reply, next) => {
    github[request.params.command]
      ? github[request.params.command](reply)
      : next()
  }
}

