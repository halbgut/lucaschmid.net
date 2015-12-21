var fs = require('fs')
var layout = require('./layout')
var getArticles = require('../../server/getArticles.js')

var buildPath = '../../../build/_html/'

getArticles('../data/blog/').forEach((article) => {
  fs.writeFile(
    `${buildPath}anotherblog-${article.name}.html`,
    layout.render('./blogArticle', { articles: [article] })
  )
})

