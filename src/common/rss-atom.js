var xml = require('xml')
var strip = require('strip')
var _ = require('lodash')

module.exports = {
  genFeeds, genRSS, genAtom
}

function genFeeds (options, items) {
  options = deepExtend({
      title: `Blog`,
      updated: (new Date),
      generator: 'Handmade by Luca Nils Schmid',
      language: 'en-GB'
  }, options)
  return [
    genAtom(options, items),
    genRSS(options, items)
  ]
}

function genAtom (options, entries) {
  var feed
  var cleanEntries
  options._attr= {
    'xmlns': 'http://www.w3.org/2005/Atom'
  }
  cleanEntries = _.map(entries, (entry) => {
    var res = {
      entry: [
        { _attr: { lang: entry.language || options.language } },
        { title: strip(entry.title) },
        { content: entry.content },
        { summary: strip(entry.summary) },
        { updated: entry.updated.toISOString() },
        {
          author: [
            { name: entry.author.name },
            { uri: entry.author.uri },
            { email: entry.author.email }
          ]
        }
      ]
    }
    _.each(entry.links, (link) => {
      var xmlLink = { link: [ { _attr: { href: link[0] } } ] }
      if(link[1]) xmlLink.link[0]._attr.rel = link[1]
      res.entry.push(link)
    })
    return res
  })
  feed = [
    { _attr: options._attr },
    { title: options.title },
    { update: options.updated.toISOString() },
    { generator: options.generator },
    { id: options.atomId },
    { link: [ { _attr: { href: options.atomId, rel: 'self' } } ] },
    { subtitle: options.subtitle }
  ].concat(cleanEntries)
  return xml({feed}, { declaration: true, indent: true })
}

function genRSS (options, entries) {
  var items
  var feed = [
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
      { lastBuildDate: (new Date).toISOString() },
      { language: options.language || 'en-GB' },
      { 'sy:updatePeriod': 'hourly' },
      { 'sy:updateFrequency': '1' },
      { link: options.rssId },
      { generator: 'Handmade by Luca Nils Schmid' }
    ] },
  ]
  feed[1].channel = feed[1].channel.concat(entries.map(function (article) {
    var xmlArticle = {
      item: [
        { title: strip(article.title) },
        { guid: article.id },
        { 'atom:link': [ { _attr: { href: article.id, rel: 'self' } } ] },
        { 'description': strip(article.summary) },
        { 'content:encoded': [ { _cdata: article.content } ] },
        { author: `${article.author.name} <${article.author.email}>` },
        { pubDate: article.updated.toISOString() }
      ]
    }
    xmlArticle.item = xmlArticle.item.concat(_.map(article.links || [], (link) => {
      var xmlLink = { 'atom:link': [ { _attr: { href: link[0] } } ] }
      if(link[1]) xmlLink['atom:link'][0]._attr.rel = link[1]
      res.entry.push(link)
    }))
    return xmlArticle
  }))
  return xml({ rss: feed }, { declaration: true, indent: true })
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

