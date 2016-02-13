const github = require('./lib/github')
const view = require('./lib/view')
const fail = require('./lib/fail')
const webdevquiz = require('./lib/webdevquiz')

var feeds

// Feed cache
require('./lib/feeds')
  .then(res => feeds = res)

module.exports = {
  '/api/github/xhr/:command': context => new Promise((res, rej) => {
    if (github.xhr[context.params.command]) {
      github.xhr[context.params.command]()
        .then(json => {
          context.body = json
          res()
        })
        .catch(err => fail(err))
    } else {
      rej()
    }
  }),
  '/api/view/xhr/:name': context => new Promise((res, rej) => {
    view.xhr(context.params.name)
      .then(html => {
        context.response = html
        context.response.type = 'text/plain'
        res()
      })
      .catch(e => {
        console.error(e)
        rej()
      })
  }),
  '/feed/:type': context => new Promise((res, rej) => {
    if (context.params.type === 'atom.xml') {
      context.body = feeds[0]
      res()
    } else if (context.params.type === 'rss.xml') {
      context.body = feeds[1]
      res()
    } else {
      rej()
    }
  }),
  '/webdevquiz': context => new Promise ((res, rej) => {
    webdevquiz(context)
    res()
  }),
  '/:p': context => new Promise((res, rej) => {
    // TODO Render 404
    context.response.status = 404
    res()
  })
}

