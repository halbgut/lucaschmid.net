const getMarkdown = require('./getMarkdown')
const config = require('../config.js')

module.exports = (root) => new Promise((resolve, reject) => {
  getMarkdown(`${root}/*`)
    .then((mdArr) => {
      resolve(
        mdArr.map((md) => {
          return {
            name: md.name,
            url: config.getFullUrl(`anotherblog/${md.name}`),
            title: md.title,
            teaser: md.paragraphs[0],
            articleContent: md.html,
            author: {
              name: 'Luca Nils Schmid',
              url: config.getFullUrl(),
              email: 'allspamhere@kriegslustig.me'
            },
            created: md.ctime
          }
        })
        .sort((a, b) => {
          return (
            a.created.getTime() > b.create
              ? 1
              : -1
          )
        })
      )
    })
    .catch(reject)
})

