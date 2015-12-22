var fs = require('fs')
var layout = require(`${__dirname}/layout`)
var getMarkdown = require(`${__dirname}/../../common/getMarkdown`)
var getArticles = require(`${__dirname}/../../common/getArticles.js`)

var buildPath = `${__dirname}/../../../build/_html/`

getArticles('blog').forEach((article) => {
  fs.writeFile(
    `${buildPath}anotherblog-${article.name}.html`,
    layout.render(`${__dirname}/blogArticle`, { articles: [article] })
  )
})

