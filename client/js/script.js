window._ = require('lodash')
window.riot = require('riot/riot.min.js') // Globally available
var nav = require('./lib/nav')

addEventListener('load', () => {
  nav()
  riot.mount('*')
})

