var fs = require('fs')
var xml = require('xml')
var strip = require('strip')
var escape = require('escape-html')
var getArticles = require(`${__dirname}/../../common/getArticles`)
var config = require(`${__dirname}/../../common/config`)

var feedLocation = `${__dirname}/../../../build/feed`

fs.writeFile(`${feedLocation}/rss.xml`, genRSS(), (err) => {if(err) console.error(err)} )

function genRSS (options, items) {
  return xml({
    rss: [
      { _attr: {
        version: '2.0',
        'xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
        'xmlns:wfw': 'http://wellformedweb.org/CommentAPI/',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
        'xmlns:atom': 'http://www.w3.org/2005/Atom',
        'xmlns:sy': 'http://purl.org/rss/1.0/modules/syndication/',
        'xmlns:slash': 'http://purl.org/rss/1.0/modules/slash/'
      } },
      { channel: [
        { lastBuildData: (new Date).toUTCString() },
        { 'atom:link': config.getFullUrl('feed/rss.xml'), _attr: { rel: 'self' } },
        { title: `${config.title} - Blog` },
        { description: config.description },
        { language: 'en-GB' },
        { 'sy:updatePeriod': 'hourly' },
        { 'sy:updateFrequency': '1' },
        { generator: 'Handmade by Luca Nils Schmid' }
      ].concat(
        getArticles('blog').map(function (article) {
          return {
            item: [
              { title: strip(article.title) },
              { link: article.url },
              { guid: article.url },
              { 'description': strip(article.teaser) },
              { 'content:encoded': article.content },
              { author: article.author.name },
              { 'dc:creator': article.author.name },
              { pubDate: article.created.toUTCString() }
            ]
          }
        })
      )}
    ]
  }, { declaration: true })
}

