var conf = require(`${__dirname}/../config.json`)
var _ = require('lodash')

module.exports = _.extend(conf, {
  getFullUrl (path) {
    return `${conf.defaultProto}://${conf.hostname}/${path || ''}`
  }
})

