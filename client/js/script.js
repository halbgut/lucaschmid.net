import nav from './lib/nav'
import footnotes from './lib/footnotes'
import riot from 'riot/riot.min.js'
import highlight from 'highlight.js'

window.riot = riot // Globally available

window.addEventListener('load', () => {
  highlight.initHighlighting()
  nav()
  footnotes()
  window.riot.mount('*')
})

