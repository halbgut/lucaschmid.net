'use strict'

const _ = require('lodash')
const router = require('koa-router')()

const view = require('./view')
const parallelPromise = require('../../common/lib/parallelPromise')
const handlebars = require('../../common/lib/handlebars')
const config = require('../../common/config')
const serverRoutes = require('../routes')
const commonRoutes = require('../../common/routes')
const fail = require('./fail')
let cache = {}

module.exports = () => {
  router.get('/clear-cache', function *(next) {
    if (this.query.key === config.cacheKey) {
      cache = {}
      this.body = 'Cache cleared!'
      this.status = 200
    } else {
      yield next
    }
  })

  _.each(commonRoutes, (genParams, route) => {
    router.get(route, function *(next) {
      const that = this
      const params = genParams(this.params)
      const cacheKey = params[2] || params[1]
      // Use cached version if it's around
      if (config.shouldCache && cache[cacheKey]) {
        that.body = cache[cacheKey]
        that.status = 200
        return
      }
      yield parallelPromise([
        view.xhr(params[0], true),
        params[1]()
      ])
        .then(results => {
          // Compile the content of the layout
          const content = handlebars.compile(results[0][1])(results[1])
          // Compile the layout
          that.body = cache[cacheKey] = handlebars.compile(
            results[0][0]
          )(
            _.chain(_.clone(config))
              .assign(results[1])
              .assign({ content })
              .assign({
                title: results[1].title
                  ? `${config.title} | ${results[1].title}`
                  : config.title
              })
              .value()
          )
        })
        .catch(err => fail(this, err))
    })
  })

  const actioner = action => function *(next) {
    const shouldContinue = yield new Promise((res, rej) => {
      action(this)
        .then(() => res(false))
        .catch((e) => {
          if (e) fail(this, e)
          if (!e) res(true)
        })
    })
    if (shouldContinue) yield next
  }

  _.each(serverRoutes.get, (action, route) =>
    router.get(route, actioner(action))
  )

  _.each(serverRoutes.post, (action, route) =>
    router.post(route, actioner(action))
  )

  return router
}

