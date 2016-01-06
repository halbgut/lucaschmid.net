var nav = require('./lib/nav')
var riot

window.riot = riot = require('riot/riot.min.js') // Globally available

window.addEventListener('load', () => {
  nav()
  riot.mount('*')
})

