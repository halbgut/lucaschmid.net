var GithubAPI = require('github')
var _ = require('lodash')

var config = require(`${__dirname}/../common/config.js`)
var github = new GithubAPI({
  version: '3.0.0',
  headers: {
    'user-agent': 'lucaschmid.net'
  }
})

var auth = github.authenticate.bind(github, {
  "type": "oauth",
  "token": config.github.token
})

function call (obj, method, msg) {
  return new Promise((res, rej) => {
    github[obj][method](
      _.extend({
        user: 'Kriegslustig',
        repo: 'lucaschmid.net'
      }, msg),
      (err, data) => {
        if(err) return rej(err)
        res(data)
      }
    )
  })
}

function failer (res) {
  return (err) => {
    res.writeHead(500)
    res.end(`{ error: ${err} }`)
  }
}

module.exports = {
  lastCommit (req, res, next) {
    auth()
    call('repos', 'getCommits', {
      per_page: 1,
      page: 0
    })
      .then((data) => res.end(JSON.stringify(data[0])))
      .catch(failer(res))
  },
}

