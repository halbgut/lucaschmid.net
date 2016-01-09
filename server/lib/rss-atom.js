var xml = require('xml')
var strip = require('strip')
var _ = require('lodash')

var defaults = {
  generator: 'Handmade by Luca Nils Schmid'
}

function genFeeds (options, items) {
  return [
    genAtom(options, items),
    genRSS(options, items)
  ]
}

function genRSS (options, entries) {
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
      { channel: mergeArrs([
        mergeArrs(_.map(generators.channel, (fn) => fn(options))),
        mergeArrs(
          _.map(entries, (entry) => {
            return {
              item: mergeArrs(_.map(generators.item, (fn) => fn(entry)))
            }
          })
        )
      ]) }
    ]
  }, { declaration: true, indent: true })
}

function genAtom (options, entries) {
  return xml({
    feed: mergeArrs([
      mergeArrs(_.map(generators.feed, (fn) => fn(options))),
      mergeArrs(
        _.map(entries, (entry) => {
          return {
            entry: mergeArrs(_.map(generators.entry, (fn) => fn(entry)))
          }
        })
      )
    ])
  }, { declaration: true, indent: true })
}

var generators = {
  channel: [
    (options) => [{ title: strip(options.title) }],
    (options) => [{ link: options.rssId }],
    (options) => [{ 'atom:link': genAtomLink([options.rssId, 'self']) }],
    (options) => [{ description: strip(options.subtitle) }],
    (options) => [{ generator: options.generator || defaults.generator }],
    (options) => options.language ? [{ language: options.language }] : [],
    (options) => [{ lastBuildDate: (options.updated || new Date()).toUTCString() }]
    // TODO: Implement image
  ],
  item: [
    (entry) => [{ title: strip(entry.title) }],
    (entry) => [{ guid: entry.id }],
    (entry) => entry.link ? [{ 'aton:link': genAtomLink(entry.link) }] : [],
    (entry) => entry.author.name && entry.author.email
      ? [{ author: `${entry.author.name} <${entry.author.email}>` }]
      : [],
    (entry) => [{ 'content:encoded': { _cdata: entry.content } }],
    (entry) => [{ description: strip(entry.summary) }],
    (entry) => entry.pubDate ? [{ pubDate: entry.pubDate }] : []
  ],
  feed: [
    (options) => [{ title: strip(options.title) }],
    (options) => [{ subtitle: strip(options.subtitle) }],
    (options) => [{ id: options.atomId }],
    (options) => [{ updated: (options.updated || new Date()).toISOString() }],
    (options) => options.author
      ? [{ author: genAtomAuthor(options.author) }]
      : [],
    (options) => [{ link: genAtomLink([options.atomId, 'self']) }],
    (options) => [{ generator: options.generator || defaults.generator }],
    (options) => options.language
      ? [{ _attr: {
        'xml:lang': options.language,
        xmlns: 'http://www.w3.org/2005/Atom'
      } }]
      : [],
    (options) => options.icon ? [{ icon: options.icon }] : [],
    (options) => options.logo ? [{ logo: options.logo }] : []
  ],
  entry: [
    (entry) => [{ id: entry.id }],
    (entry) => [{ title: strip(entry.title) }],
    (entry) => [{ updated: entry.updated.toISOString() }],
    (entry) => [{ author: genAtomAuthor(entry.author) }],
    (entry) => [{ link: genAtomLink([entry.id, 'self']) }],
    (entry) => [{ summary: strip(entry.summary) }],
    (entry) => [{ content: [ { _attr: { type: 'html' } }, entry.content ] }]
  ]
}

function mergeArrs (arrs, withArr) {
  return (withArr || []).concat.apply([], arrs)
}

function genAtomLink (link) {
  var res = { _attr: { href: link[0] } }
  if (link[1]) res._attr.rel = link[1]
  return [res]
}

function genAtomAuthor (author) {
  var res = []
  if (author.name) res.push({ name: author.name })
  if (author.email) res.push({ email: author.email })
  if (author.uri) res.push({ uri: author.uri })
  return res
}

module.exports = {
  genFeeds, genRSS, genAtom, generators
}

