const api = require('./api.js')
const jade = require('jade')

const renderer = (cb) => (data) => {
  document.getElementsByClassName[0]
    .innerHtml = cb(data)
}

module.exports = (name) =>
  api('view', name)
    .then((tpl) =>
      renderer(jade.compile(tpl))
    )

