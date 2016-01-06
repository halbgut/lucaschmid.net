var conf = require(`${__dirname}/../config.json`)
var _ = require('lodash')

if (process.NODE_ENV !== 'production') {
  conf = _.extend(conf, conf.dev)
}

module.exports = _.extend(conf, {
  getFullUrl (path) {
    return `${conf.defaultProto}://${conf.hostname}${path ? '/' + path : ''}`
  },
  getBuildPath (path) {
    return `${__dirname}/../../${conf.buildDir}${path ? '/' + path : ''}`
  }
})

