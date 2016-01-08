const _ = require('lodash')
const env = require('./lib/env')

var conf = require(`../config.json`)

if (process.NODE_ENV !== 'production') {
  conf = _.extend(conf, conf.dev)
}

if(env === 'server') {
  conf = _.extend(conf, require('../server/config.json'))
}

module.exports = _.extend(conf, {
  getFullUrl (path) {
    return `${conf.defaultProto}://${conf.hostname}${path ? '/' + path : ''}`
  },
  getBuildPath (path) {
    return `${__dirname}/../../${conf.buildDir}${path ? '/' + path : ''}`
  }
})

