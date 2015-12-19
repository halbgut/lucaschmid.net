var handlebars = require('handlebars')
var fs = require('fs')

module.exports = {
  render (contentFile, data, titleSuff) {
    var data = data || {}
    var title = titleSuff
      ? `Luca Nils Schmid - ${titleSuff}`
      : 'Luca Nils Schmid'
    return this.getTemplate('./layout', {
      title,
      content: this.getTemplate(contentFile, data)
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

