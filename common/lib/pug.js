const pug = require('jade')
const _ = require('lodash')

const env = require('./env.js')
const loadFilePath = '../helpers/loadFile.js'

module.exports = (str, filename) => {
  const globals = {}
  if (env === 'server') globals.loadFile = require(loadFilePath)
  return (data) => pug.compile(
    str,
    { filename }
  )(_.extend(data, globals))
}

