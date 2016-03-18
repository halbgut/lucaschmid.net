const pug = require('jade')
const _ = require('lodash')

const env = require('./env.js')
const loadFilePath = '../helpers/loadFile.js'

module.exports = (str) => {
  const globals = {}
  if (env === 'server') globals.loadFile = require(loadFilePath)
  return (data) => pug.compile(str)(_.extend(data, globals))
}

