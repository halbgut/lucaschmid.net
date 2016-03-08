const pug = require('jade')
const _ = require('lodash')

module.exports = function (data) {
  data.getFullUrl = require('../helpers/getFullUrl.js')
  return pug.compile.call(pug, data)
}

