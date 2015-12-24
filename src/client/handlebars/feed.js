var fs = require('fs')
var xml = require('xml')
var strip = require('strip')
var escape = require('escape-html')
var _ = require('lodash')

var getArticles = require(`${__dirname}/../../common/getArticles`)
var config = require(`${__dirname}/../../common/config`)

var feedLocation = `${__dirname}/../../../build/feed`

fs.writeFile(
  `${feedLocation}/rss.xml`,
  genRSS(
    { channel: {
      'atom:link': [config.getFullUrl('feed/rss.xml'), { rel: 'self' }],
      title: `Blog`,
      description: config.description,
      language: 'en-GB',
      'sy:updatePeriod': 'hourly',
      'sy:updateFrequency': '1',
      generator: 'Handmade by Luca Nils Schmid',
    } },
    getArticles('blog').map((article) => {
      return {
        title: article.title,
        link: article.url,
        description: article.teaser,
        content: article.content,
        author: article.author.name,
        pubDate: article.created
      }
    })
  ),
  (err) => {if(err) console.error(err)}
)

fs.writeFile(
  `${feedLocation}/atom.xml`,
  genAtom(
    {
      title: `Blog`,
      link: [config.getFullUrl('feed/rss.xml'), { rel: 'self' }],
      id: config.getFullUrl('feed/rss.xml'),
      subtitle: config.description
    },
    getArticles('blog').map((article) => {
      return [
        { title: article.title },
        { link: article.url },
        { summary: article.teaser },
        { content: article.content },
        { author: [ { name: article.author.name }, { link: article.author.url } ] },
        { updated: article.created }
      ]
    })
  ),
  (err) => {if(err) console.error(err)}
)

function genRSS (options, items) {
  var rssFeed = objToXMLObj(deepExtend({
    _attr: {
      version: '2.0',
      'xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
      'xmlns:wfw': 'http://wellformedweb.org/CommentAPI/',
      'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
      'xmlns:atom': 'http://www.w3.org/2005/Atom',
      'xmlns:sy': 'http://purl.org/rss/1.0/modules/syndication/',
      'xmlns:slash': 'http://purl.org/rss/1.0/modules/slash/'
    },
    channel: {
      lastBuildData: (new Date).toUTCString(),
      language: 'en-GB',
      'sy:updatePeriod': 'hourly',
      'sy:updateFrequency': '1',
      generator: 'Handmade by Luca Nils Schmid',
    },
  }, options))
  rssFeed[1].channel = rssFeed[1].channel.concat(
    items.map(function (article) {
      return {
        item: [
          { title: strip(article.title) },
          { link: article.link },
          { guid: article.guid || article.link },
          { 'description': strip(article.description) },
          { 'content:encoded': article.content },
          { author: article.author },
          { 'dc:creator': article.author },
          { pubDate: article.pubDate.toUTCString() }
        ]
      }
    })
  )
  return xml({ rss: rssFeed }, { declaration: true })
}

function genAtom (options, entries) {
  var feed = objToXMLObj(deepExtend({
      _attr: {
        'xmlns:atom': 'http://www.w3.org/2005/Atom'
      },
      title: `Blog`,
      updated: (new Date).toUTCString(),
      language: 'en-GB',
      generator: 'Handmade by Luca Nils Schmid',
  }, options))
    .concat(entries.map((entry) => { return { entry: transformAtomEntry(entry) } } ))
  console.error(feed)
  return xml({feed}, { declaration: true })
}

function deepExtend (to, from) {
  _.each(from, (value, key) => {
    if(
      typeof value === 'object'
      && typeof to[key] === 'object'
    ) {
      to[key] = deepExtend(to[key], value)
    } else {
      to[key] = value
    }
  })
  return to
}

function objToXMLObj (obj) {
  if(typeof obj !== 'object') return obj
  return _.map(obj, (val, key) => {
    key = key.split('!')[0]
    if (key === '_attr') return { _attr: val }
    if (Array.prototype.isPrototypeOf(val)) return { [key]: [ objToXMLObj(val[0]),  { _attr: val[1] } ] }
    if (typeof val === 'object') return { [key]: objToXMLObj(val) }
    return { [key]: val }
  })
}

function transformAtomEntry (entry) {
  return _.map(entry, (el) => {
    var key = Object.keys(el)[0]
    var mod = {
      content (content) {
        return (
          typeof content === 'string'
            ? [{ _attr: { type: 'html' } }, content]
            : content
        )
      },
      updated (date) {
        return date.toUTCString()
      }
    }[key]
    if(mod) el[key] = mod(el[key])
    return el
  })
}

