var layout = require('./layout')
var fs = require('fs')
var showdown = require('showdown')

var mdConverter = new showdown.Converter

process.stdout.write(layout.render('./blog', {
  articles: getArticles()
}))

function getArticles () {
  return fs.readdirSync('../data/blog').map((path) => {
    return {
      content: mdConverter.makeHtml(
        fs.readFileSync(`../data/blog/${path}`, 'utf8')
      ),
      author: {
        name: 'Luca Nils Schmid',
        url: '/',
      },
      created: fs.statSync(`../data/blog/${path}`).ctime
    }
  })
}

