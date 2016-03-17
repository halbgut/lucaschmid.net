const pug = require('jade')
const _ = require('lodash')

module.exports = str => {
  const globals = {
    loadFile: require('../helpers/loadFile.js')
  }
  return data => pug.compile(str)(_.extend(data, globals))
}

