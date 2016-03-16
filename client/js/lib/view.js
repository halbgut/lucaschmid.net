const api = require('./api.js')
const jade = require('jade')

const renderer = cb => (data) => {
  document.getElementsByClassName[0]
    .innerHtml = cb(data)
}

module.exports = name => new Promise((res, rej) => {
  api('view', name)
    .then(tpl =>
      res(
        renderer(jade.compile(tpl))
      )
    )
    .catch(rej)
})

