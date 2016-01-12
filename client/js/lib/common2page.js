const _ = require('lodash')
const view = require('./view')
const parallelPromise = require('../../../common/lib/parallelPromise')

const getContainer = () => document.getElementsByClassName('content')[0]
const reload = () => window.location = window.location

module.exports = routes => _.map(routes, (getParams, route) => [
  route,
  (context, next) => {
    const params = getParams(context)
    const container = getContainer()
    parallelPromise([
      view(params[0]),
      params[1]()
    ])
      .then(results => {
        container.innerHTML = results[0](results[1])
      })
      .catch(reload)
  }
])

