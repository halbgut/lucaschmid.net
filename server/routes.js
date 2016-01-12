const github = require('./lib/github')
const view = require('./lib/view')
const fail = require('./lib/fail')

var feeds

// Feed cache
require('./lib/feeds')
  .then(res => feeds = res)

module.exports = {
  '/api/github/xhr/:command': (next) => {
    if (github.xhr[this.params.command]) {
      github.xhr[this.params.command]()
        .then(res => {
          this.body = res
        })
        .catch(err => fail(err))
    } else {
      next()
    }
  },
  '/api/view/xhr/:name': (next) => {
    view.xhr(this.params.name)
      .then(html => {
        this.response = html
        this.response.type('text/plain')
      })
      .catch(e => {
        console.error(e)
        next()
      })
  },
  '/feed/:type': (next) => {
    if (this.params.type === 'atom') this.body = feeds[0]
    if (this.params.type === 'rss') this.body = feeds[1]
    next()
  },
  '/{p*}': (next) => {
    // TODO Render 404
    this.response.code = 404
  }
}

