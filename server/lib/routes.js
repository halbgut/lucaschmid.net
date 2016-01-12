const _ = require('lodash')
const router = require('koa-router')()

const view = require('./view')
const parallelPromise = require('../../common/lib/parallelPromise')
const handlebars = require('../../common/lib/handlebars')
const config = require('../../common/config')
const serverRoutes = require('../routes')
const commonRoutes = require('../../common/routes')
const fail = require('./fail')
const cache = {}

module.exports = () => {
  _.each(commonRoutes, (genParams, route) => {
    router.get(route, function *(next) {
      const that = this
      const params = genParams(this.params)
      const cacheKey = params[2] || params[1]
      // Use cached version if it's around
      if (cache[cacheKey]) {
        that.body = cache[cacheKey]
        return
      }
      yield parallelPromise([
        view.xhr(params[0], true),
        params[1]()
      ])
        .then(results => {
          const content = handlebars.compile(results[0][1])(results[1])
          that.body = cache[cacheKey] = handlebars.compile(results[0][0], config)({ content })
        })
        .catch(err => fail(err))
    })
  })
  _.each(serverRoutes, (action, route) => {
    router.get(route, function *(next) {
      const shouldContinue = yield new Promise((res, rej) => {
        action(this)
          .then(() => res(false))
          .catch((e) => {
            if (e) fail(e)
            if (!e) res(true)
          })
      })
      if (shouldContinue) yield next
    })
  })
  return router
}

