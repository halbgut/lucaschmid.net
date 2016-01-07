const Handlebars = require('handlebars')

const env = window ? 'client' : 'server'
const render = str => Handlebars.compile(str)

module.exports = name => {
  return new Promise((res, rej) => {
    if (env === 'server') {
      require('fs').readFile(`${__dirname}/templates/${name}`, { encoding: 'utf8' }, (err, data) => {
        if(err) return rej(err)
        res(render(data))
      })
    } else {
      require('../client/xhr')(`/api/templates/${name}`)
        .then( data => res(render(data)) )
        .catch(rej)
    }
  })
}

