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
    return {
      html: mdConverter.makeHtml(md),
    }
  },
  getPath: () => path
}

