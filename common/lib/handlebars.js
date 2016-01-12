const Handlebars = require('handlebars')

Handlebars.registerHelper('getFullUrl', require('../helpers/getFullUrl.js'))

module.exports = Handlebars

