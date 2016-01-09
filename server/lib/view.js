const fs = require('fs')

const config = require('../../common/config')
const promisify = require('../../common/lib/promisify')

const getTemplate = name => new Promise((res, rej) => {
  if (name.indexOf('.') > -1) return rej('Invalid character in name')
  promisify(fs.readFile.bind(null, `${__dirname}/../../${config.templateDir}/${name}.html`, { encoding: 'utf8' }))
    .then(res)
    .catch(rej)
})

module.exports = {
  xhr: (name, request, reply) => new Promise((res, rej) => {
    getTemplate(name)
      .then(res)
      .catch(rej)
  }),
  ws: (name, socket) => {
    getTemplate(name)
      .then(js => socket.send(js))
      .catch(e => { throw e })
  }
}
