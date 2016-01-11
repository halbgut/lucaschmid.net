const _ = require('lodash')
const router = require('koa-router')()

const serverRoutes = require('../routes')
const commonRoutes = require('../../common/routes')
const fail = require('./fail')

module.exports = (app) => {
  _.each(commonRoutes, (action, route) => {
    app.get(route, function *(next) {
      action(this)
        .then(res => {
          if(res) {
            this.body = res
          } else {
            next()
          }
        })
        .catch(err => fail(err))
    })
  })
  _.each(serverRoutes, (route) => {
    app.get(route, function *(next) {
      action(this, next)
    })
  })
}

