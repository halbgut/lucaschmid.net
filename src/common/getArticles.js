var fs = require('fs')
var getMarkdown = require(`${__dirname}/getMarkdown`)

module.exports = (root) => {
  return fs.readdirSync(`${getMarkdown.getPath()}/${root}`)
    .map((path) => {
      var name = path.split('.').slice(0, -1).join('.')
      return {
        name,
        url: `/anotherblog/${name}`,
        content: getMarkdown.render(`${root}/${name}`).html,
        author: {
          name: 'Luca Nils Schmid',
          url: '/',
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

