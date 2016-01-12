const _ = require('lodash')
const router = require('koa-router')()

const serverRoutes = require('../routes')
const commonRoutes = require('../../common/routes')
const fail = require('./fail')

module.exports = () => {
  _.each(commonRoutes, (action, route) => {
    router.get(route, function *(next) {
      action(this)
        .then(res => {
          if (res) {
            this.body = res
          } else {
            next()
          }
        })
        .catch(err => fail(err))
    })
  })
  _.each(serverRoutes, (action, route) => {
    router.get(route, function *(next) {
      action(next)
    })
  })
  return router
}

