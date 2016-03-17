const nav = require('./lib/nav.js')
const footnotes = require('./lib/footnotes.js')
const blacklist = require('./lib/blacklist.js')
const highlight = require('highlight.js')

require('../tags/commentform.tag')
require('../tags/comments.tag')
require('../tags/custom-navigation.tag')
require('../tags/work-in-progress.tag')

riot.mount('*')
window.riot = riot

window.addEventListener('load', () => {
  highlight.initHighlighting()
  nav()
  footnotes()
  if (window.location.path === '/blacklist') {
    blacklist()
  }
})

