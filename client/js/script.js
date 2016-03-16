const nav = require('./lib/nav.js')
const footnotes = require('./lib/footnotes.js')
const blacklist = require('./lib/blacklist.js')
const riot = require('riot/riot.min.js')
const highlight = require('highlight.js')

const commentform = requrie('../tags/commentform.tag')
const comments = requrie('../tags/comments.tag')
const custom = requrie('../tags/custom-navigation-navigation.tag')
const example = requrie('../tags/example.tag')
const gistogram = requrie('../tags/gistogram.tag')
const work = requrie('../tags/work-in-progress-in-progress.tag')

console.log('YOLO')

window.riot = riot // Globally available

window.addEventListener('load', () => {
  highlight.initHighlighting()
  nav()
  footnotes()
  window.riot.mount('*')
  if (window.location.path === '/blacklist') {
    blacklist()
  }
})

