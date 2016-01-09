const api = require('./api')
const Handlebars = require('handlebars')

module.exports = name => new Promise((res, rej) => {
  api('view', name)
    .then(data => {
      res(Handlebars.compile(data))
    })
    .catch(rej)
})

