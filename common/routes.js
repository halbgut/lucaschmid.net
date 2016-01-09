const _ = require('lodash')
const parallelPromise = require('./lib/parallelPromise')
const getMarkdown = require(`./lib/getMarkdown`)

module.exports = {
  '/': params => [
    'start',
    () => new Promise((res, rej) => {
      parallelPromise([
        getMarkdown('start'),
        getMarkdown('skills'),
        getMarkdown('references')
      ])
        .then((mdArr) => {
          res({ sections: mdArr.map((md) => md[0].html) })
        })
    })
  ],
  '/projects': params => [
    'projects',
    () => new Promise((res, rej) => {
      getMarkdown('projects/*')
        .then((mdArr) => res({ projects: mdArr.map((md) => md.html) }))
    })
  ],
  '/{p*}': params => [
    '404',
    () => new Promise(res => res({}))
  ]
}

