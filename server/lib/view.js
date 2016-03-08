const fs = require('fs')

const config = require('../../common/config')
const promisify = require('../../common/lib/promisify')
const parallelPromise = require('../../common/lib/parallelPromise')

const getTemplateFile = name => promisify(
  fs.readFile.bind(
    null,
    `${__dirname}/../../${config.templateDir}/${name}.pug`,
    { encoding: 'utf8' }
  )
)

const getTemplate = (name, includeLayout) => new Promise((res, rej) => {
  if (name.indexOf('.') > -1) return rej('Invalid character in name')
  const promise = includeLayout
      ? parallelPromise([
        getTemplateFile('layout'),
        getTemplateFile(name)
      ])
      : getTemplateFile(name)
  promise
    .then(res)
    .catch(rej)
})

module.exports = {
  xhr: (name, includeLayout) => new Promise((res, rej) => {
    getTemplate(name, includeLayout)
      .then(res)
      .catch(rej)
  }),
  ws: (name, socket, includeLayout) => {
    getTemplate(name, includeLayout)
      .then(js => socket.send(js))
      .catch(e => { throw e })
  }
}
