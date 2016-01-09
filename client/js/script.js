const page = require('page')
const nav = require('./lib/nav')
const routes = require('./lib/hapi2page')(require('../../common/routes'))

window.page = page

routes.forEach(route => {
  page(route[0], route[1])
})

window.riot = require('riot/riot.min.js') // Globally available

window.addEventListener('load', () => {
  nav()
  riot.mount('*')
})

