import nav from './lib/nav'
import footnotes from './lib/footnotes'
import riot from 'riot/riot.min.js'

window.riot = riot // Globally available

window.addEventListener('load', () => {
  nav()
  footnotes()
  window.riot.mount('*')
})

