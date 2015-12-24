var fs = require('fs')
var getMarkdown = require(`${__dirname}/getMarkdown`)
var config = require(`${__dirname}/config.js`)

module.exports = (root) => {
  return fs.readdirSync(`${getMarkdown.getPath()}/${root}`)
    .map((path) => {
      var name = path.split('.').slice(0, -1).join('.')
      var content = getMarkdown.render(`${root}/${name}`)
      return {
        name,
        url: config.getFullUrl(`anotherblog/${name}`),
        title: content.title,
        teaser: content.paragraphs[0],
        content: content.html,
        author: {
          name: 'Luca Nils Schmid',
          url: config.getFullUrl(),
        },
        created: fs.statSync(`${getMarkdown.getPath()}/${root}/${path}`).ctime
      }
    })
    .sort((a, b) => {
      return (
        a.created.getTime() > b.create
          ? 1
          : -1
      )
    })
}

