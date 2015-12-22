var layout = require(`${__dirname}/layout`)
var getArticles = require(`${__dirname}/../../common/getArticles.js`)

process.stdout.write(layout.render(`${__dirname}/blog`, {
  articles: getArticles('blog').map((article) => {
    // This is pretty bad. But it works fairly well.
    article.teaser = /(<h1[^>]*>.+<\/h1>)[^<]*<p>.*<\/p>/g.exec(article.content)[0]
    return article
  })
}))

