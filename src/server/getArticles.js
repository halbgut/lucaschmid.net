var fs = require('fs')
var showdown = require('showdown')

var mdConverter = new showdown.Converter

module.exports = (root) => {
  return fs.readdirSync(root)
    .map((path) => {
      var name = path.split('.').slice(0, -1).join('.')
      return {
        name,
        url: `/anotherblog/${name}`,
        content: mdConverter.makeHtml(
          fs.readFileSync(`${root}${path}`, 'utf8')
        ),
        author: {
          name: 'Luca Nils Schmid',
          url: '/',
        },
        created: fs.statSync(`${root}${path}`).ctime
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

