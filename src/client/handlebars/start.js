var layout = require('./layout')
var showdown = require('showdown')
var fs = require('fs')

var mdConverter = new showdown.Converter

var main = mdConverter.makeHtml(fs.readFileSync('../data/start.md','utf8'))
var skills = mdConverter.makeHtml(fs.readFileSync('../data/skills.md','utf8'))

process.stdout.write(layout.render(
  './start',
  {
    sections: [main, skills]
  }
))

