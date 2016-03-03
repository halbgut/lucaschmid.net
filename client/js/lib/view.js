const api = require('./api')
const Handlebars = require('handlebars')

const renderer = cb => (data) => {
  document.getElementsByClassName[0]
    .innerHtml = cb(data)
}

module.exports = name => new Promise((res, rej) => {
  api('view', name)
    .then(tpl =>
      res(
        renderer(Handlebars.compile(tpl))
      )
    )
    .catch(rej)
})

