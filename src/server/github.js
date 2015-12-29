var EventEmitter = require('events')
var GithubAPI = require('github')
var _ = require('lodash')

var ratelimiter = require(`${__dirname}/ratelimiter`)
var config = require(`${__dirname}/../common/config.js`)

var github = new GithubAPI({
  version: '3.0.0',
  headers: {
    'user-agent': 'lucaschmid.net'
  }
})

var emitter = new EventEmitter()

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

var getCommit = (() => {
  var lastCommit
  var updating = false
  return () => {
    return new Promise((res, rej) => {
      if(
        (
          lastCommit
          && (new Date).getTime() - lastCommit.updated < 60000 // cache for a minute
        )
        || updating
      ) return res(lastCommit.data)
      updating = true
      auth()
      call('repos', 'getCommits', {
        per_page: 1,
        page: 0
      })
        .then((response) => {
          var data = JSON.stringify(response[0])
          updating = false
          if(lastCommit && data === lastCommit.data) {
            lastCommit.updated = (new Date).getTime()
            return
          }
          lastCommit = {
            updated: (new Date).getTime(),
            data
          }
          emitter.emit('newCommit', data)
          res(data)
        })
        .catch((err) => {updating = false})
    })
  }
})()

module.exports = {
  json: {
    lastCommit (req, res, next) {
      getCommit()
        .then((data) => res.end(data))
        .catch(failer(res))
    },
  },
  ws: {
    lastCommit (socket) {
      if(ratelimiter.get() >= 10) {
        socket.close(1000, 'Sorry, I\'m over capacity.')
        return
      }
      ratelimiter.inc()
      socket.on('close', ratelimiter.dec)
      getCommit()
        .then((data) => socket.send(data))
        .catch(console.error.bind(console))
      emitter.on('newCommit', (data) => socket.send(data))
    },
  },
  private: {
    watchLastCommit () {
      return setInterval(getCommit, 1000)
    }
  }
}

