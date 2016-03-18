const nav = require('./lib/nav.js')
const footnotes = require('./lib/footnotes.js')
const blacklist = require('./lib/blacklist.js')
const highlight = require('highlight.js') // Adds more than 100KB to the bundle
const riot = require('riot')

require('../tags/commentform.tag')
require('../tags/comments.tag')
require('../tags/custom-navigation.tag')
require('../tags/work-in-progress.tag')

const common2page = require('./lib/common2page.js')
common2page(require('../../common/routes.js'))

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

