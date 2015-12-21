var handlebars = require('handlebars')
var fs = require('fs')
var _ = require('lodash')

module.exports = {
  render (contentFile, data, options) {
    var data = data || {}
    var options = options || {}
    var title = options.titleSuffix
      ? `Luca Nils Schmid - ${titleSuff}`
      : 'Luca Nils Schmid'
    return this.getTemplate('./layout', {
      title,
      content: this.getTemplate(contentFile, data),
      lang: 'en',
      meta: _.extend({
        viewport: 'width=device-width,initial-scale=1',
        description: 'My name is Luca Nils Schmid. This is my portfolio.',
        keywords: 'luca nils schmid, kriegslustig, webdevelopment, node.js'
      }, options.meta)
    })
  },
  getTemplate (name, data) {
    var file
    try {
      if(fs.statSync(name).isFile()) file = name
    } catch (e) {
      file = `${name}.handlebars`
    }
    return handlebars.compile(
      fs.readFileSync(file, 'utf8')
    )(data)
  }
}

