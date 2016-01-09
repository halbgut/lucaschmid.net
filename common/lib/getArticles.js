const fs = require('fs')
const getMarkdown = require(`./getMarkdown`)
const config = require(`../config.js`)

module.exports = root => new Promise((res, rej) => {
  getMarkdown(`${root}/*`)
    .then(mdArr => {
      res(
        mdArr.map(md => {
          return {
            name: md.name,
            url: config.getFullUrl(`anotherblog/${md.name}`),
            title: md.title,
            teaser: md.paragraphs[0],
            content: md.html,
            author: {
              name: 'Luca Nils Schmid',
              url: config.getFullUrl(),
              email: 'allspamhere@kriegslustig.me'
            },
            created: fs.statSync(md.file).ctime
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
    .catch(rej)
})

