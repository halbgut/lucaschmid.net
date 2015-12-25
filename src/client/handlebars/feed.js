var fs = require('fs')

var getArticles = require(`${__dirname}/../../common/getArticles`)
var config = require(`${__dirname}/../../common/config`)
var rssAtom = require(`${__dirname}/../../common/rss-atom`)

var feedLocation = `${__dirname}/../../../build/feed`

var feeds = rssAtom.genFeeds(
  {
    title: `${config.title} - Blog`,
    link: [config.getFullUrl('feed/rss.xml'), 'self'],
    id: config.getFullUrl('feed/rss.xml'),
    subtitle: config.description
  },
  getArticles('blog').map((article) => {
    return [
      { title: article.title },
      { link: [article.url, 'self'] },
      { summary: article.teaser },
      { content: article.content },
      { author: [ { name: article.author.name }, { link: article.author.url }, { email: article.author.email } ] },
      { updated: article.created.toUTCString() }
    ]
  })
)
fs.writeFile(
  `${feedLocation}/rss.xml`,
  feeds[1],
  (err) => {if(err) console.error(err)}
)

fs.writeFile(
  `${feedLocation}/atom.xml`,
  feeds[0],
  (err) => {if(err) console.error(err)}
)

