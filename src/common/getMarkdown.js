var showdown = require('showdown')
var fs = require('fs')

var mdConverter = new showdown.Converter

var path = `${__dirname}/../data/`

module.exports = {
  render (name) {
    var md
    try {
      md = fs.readFileSync(`${path}${name}.md`,'utf8')
    } catch (e) {
      md = fs.readFileSync(`${path}${name}`,'utf8')
    }
    var html = mdConverter.makeHtml(md)
    return {
      html,
      paragraphs: /<p>(.*)<\/p>/g.exec(html),
      title: /<h1 (id=\"\w*\")?>(.*)<\/h1>/g.exec(html)[0] // The regex narrow implementation that only works well for showdown
    }
  },
  getPath: () => path
}

