const fs = require('fs')

const config = require('../../common/config')
const promisify = require('../../common/lib/promisify')
const parallelPromise = require('../../common/lib/parallelPromise')

const getTemplateFile = (name) => promisify(
  fs.readFile.bind(
    null,
    `${__dirname}/../../${config.templateDir}/${name}.pug`,
    { encoding: 'utf8' }
  )
)

const getTemplate = (name, includeLayout) => new Promise((resolve, reject) => {
  if (name.indexOf('.') > -1) return reject('Invalid character in name')
  const promise = includeLayout
      ? parallelPromise([
        getTemplateFile('layout'),
        getTemplateFile(name)
      ])
      : getTemplateFile(name)
  promise
    .then(resolve)
    .catch(reject)
})

module.exports = {
  xhr: (name, includeLayout) => new Promise((resolve, reject) => {
    getTemplate(name, includeLayout)
      .then(resolve)
      .catch(reject)
  }),
  ws: (name, socket, includeLayout) => {
    getTemplate(name, includeLayout)
      .then((js) => socket.send(js))
      .catch((e) => { throw e })
  }
}
