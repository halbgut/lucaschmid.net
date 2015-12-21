var layout = require('./layout')
var getArticles = require('../../server/getArticles.js')

process.stdout.write(layout.render('./blog', {
  articles: getArticles('../data/blog/').map((article) => {
    // This is pretty bad. But it works fairly well.
    article.teaser = /(<h1[^>]*>.+<\/h1>)[^<]*<p>.*<\/p>/g.exec(article.content)[0]
    return article
  })
}))

