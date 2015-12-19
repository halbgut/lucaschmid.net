var layout = require('./layout')
var showdown = require('showdown')
var fs = require('fs')

var mdConverter = new showdown.Converter

process.stdout.write(layout.render(
  './start',
  {
    content: mdConverter.makeHtml(fs.readFileSync('../data/start.md','utf8'))
  }
))

