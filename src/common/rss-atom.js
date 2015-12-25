var xml = require('xml')
var strip = require('strip')
var _ = require('lodash')

module.exports = {
  genFeeds, genRSS, genAtom
}

function genFeeds (options, items) {
  return [
    genAtom(options, items),
    atomObjToRSS(options, items)
  ]
}

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
      lastBuildDate: (new Date).toUTCString(),
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
          { pubDate: article.pubDate }
        ]
      }
    })
  )
  return xml({ rss: rssFeed }, { declaration: true })
}

function genAtom (options, entries) {
  entries = _.clone(entries)
  var feed = objToXMLObj(deepExtend({
      _attr: {
        'xmlns:atom': 'http://www.w3.org/2005/Atom'
      },
      title: `Blog`,
      updated: (new Date).toUTCString(),
      language: 'en-GB',
      generator: 'Handmade by Luca Nils Schmid',
  }, options))
    .concat(_.map(entries, (entry) => { return { entry: transformAtomEntry(entry) } } ))
  return xml({feed}, { declaration: true })
}

function atomObjToRSS (options, entries) {
  items = entries.map(entryToItem)
  return genRSS(atomToRSSOpts(options), items)
}

function atomToRSSOpts (options) {
  var res = {}
  _.each(options, (val, key) => {
    ({
      id (val, key) { res.link = val },
      updated (val, key) { res.pubDate = val },
      author (val, key) { res.author = findObj(val, 'name') },
      subtitle (val, key) { res.description = val }
    }[key] || ((val, key) => res[key] = val))(val, key)
  })
  return { channel: res }
}

function entryToItem (entry) {
  var res = {}
  _.each(entry, (val) => {
    var key = Object.keys(val)[0]
    ;({
      id (val, key) { res.guid = val[key] },
      updated (val, key) { res.pubDate = val[key] },
      author (val, key) { res.author = findObj(val[key], 'name') },
      summary (val, key) { res.description = val[key] }
    }[key] || ((val, key) => res[key] = val[key]))(val, key)
  })
  return res
}

function findObj (obj, key) {
  var res
  _.each(obj, (val) => {
    if(Object.keys(val)[0] === key) res = val[key]
  })
  return res
}

function keyChanger (newKey) {
  var obj = {}
  obj[newKey]
  return (val, key) => obj
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
    el = _.cloneDeep(el)
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
        return date
      }
    }[key]
    if(mod) el[key] = mod(el[key])
    return el
  })
}

