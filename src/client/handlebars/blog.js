var layout = require('./layout')
var getArticles = require('../../server/getArticles.js')

process.stdout.write(layout.render('./blog', {
  articles: getArticles('../data/blog/')
}))

