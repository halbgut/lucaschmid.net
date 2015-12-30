var handlebars = require('handlebars')
var fs = require('fs')
var _ = require('lodash')

var config = require(`${__dirname}/../../common/config`)

handlebars.registerHelper('inlineCSS', (path) => {
  var css = fs.readFileSync(`${__dirname}/../../../build/${path}`, 'utf8')
  return new handlebars.SafeString(`<style>${css}</style>`)
})

module.exports = {
  render (contentFile, data, options) {
    var data = data || {}
    var options = options || {}
    var title = options.titleSuffix
      ? `${config.title} - ${titleSuff}`
      : config.title
    return this.getTemplate('./layout', {
      title,
      content: this.getTemplate(contentFile, data),
      lang: 'en',
      meta: _.extend({
        viewport: 'width=device-width,initial-scale=1',
        description: config.description,
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

