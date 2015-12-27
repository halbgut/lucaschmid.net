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
      lastBuildDate: (new Date).toISOString(),
      language: 'en-GB',
      'sy:updatePeriod': 'hourly',
      'sy:updateFrequency': '1',
      generator: 'Handmade by Luca Nils Schmid',
    },
  }, transformRSSOptions(options)))
  rssFeed[1].channel = rssFeed[1].channel.concat(
    items.map(function (article) {
      var link = article['atom:link']
      return {
        item: [
          { title: strip(article.title) },
          { 'atom:link': link },
          { guid: article.guid || link._attr.href },
          { 'description': strip(article.description) },
          { 'content:encoded': article.content },
          { author: article.author },
          { pubDate: article.pubDate.toISOString() }
        ]
      }
    })
  )
  return xml({ rss: rssFeed }, { declaration: true, indent: true })
}

function genAtom (options, entries) {
  entries = _.clone(entries)
  var feed = objToXMLObj(deepExtend({
      _attr: {
        'xmlns': 'http://www.w3.org/2005/Atom',
        lang: 'en-GB'
      },
      title: `Blog`,
      updated: (new Date).toISOString(),
      generator: 'Handmade by Luca Nils Schmid',
  }, transformAtomOptions(options)))
    .concat(_.map(entries, (entry) => { return { entry: transformAtomEntry(entry) } } ))
  return xml({feed}, { declaration: true, indent: true })
}

function atomObjToRSS (options, entries) {
  items = entries.map(entryToItem)
  return genRSS(atomToRSSOpts(options), items)
}

function atomToRSSOpts (options) {
  var res = {}
  _.each(options, (val, key) => {
    ({
      id (val, key) { },
      updated (val, key) { res.pubDate = val },
      author (val, key) { res.author = `${findObj(val, 'name')} <${findObj(val, 'email')}>` },
      subtitle (val, key) { res.description = val },
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
      author (val, key) { res.author = findObj(val[key], 'email') },
      author (val, key) { res.author = `${findObj(val[key], 'name')} <${findObj(val[key], 'email')}>` },
      summary (val, key) { res.description = val[key] },
      link (val, key) { res['atom:link'] = { _attr: { href: val[key][0], rel: val[key][1] } } }
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
      updated (date) { return date.toISOString() },
      link (link) { return { _attr: { href: link[0], rel: link[1] } } },
      title (title) { return strip(title) },
      summary (summary) { return strip(summary) }
    }[key]
    if(mod) el[key] = mod(el[key])
    return el
  })
}

function transformRSSOptions (options) {
  var res = {}
  _.each(options.channel, (val, key) => {
    ({
      link (val, key) { res.link = val[0] }
    }[key] || ((val, key) => res[key] = val))(val, key)
  })
  return { channel: res }
}

function transformAtomOptions (options) {
  var res = {}
  _.each(options, (val, key) => {
    ({
      link (val, key) { res.link = { _attr: { href: val[0], rel: val[1] } } },
      title (val, key) { res.title = strip(val) }
    }[key] || ((val, key) => res[key] = val))(val, key)
  })
  return res
}

