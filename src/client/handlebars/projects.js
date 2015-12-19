var layout = require('./layout')
var showdown = require('showdown')
var fs = require('fs')

var mdConverter = new showdown.Converter

process.stdout.write(layout.render(
  './projects',
  {
    projects: getProjects()
  }
))

function getProjects () {
  return fs.readdirSync('../data/projects').map((path) => {
    return {
      content: mdConverter.makeHtml(
        fs.readFileSync(`../data/projects/${path}`, 'utf8')
      )
    }
  })
}

