var layout = require(`${__dirname}/layout`)
var getMarkdown = require(`${__dirname}/../../common/getMarkdown`)

process.stdout.write(layout.render(
  './start',
  {
    sections: [getMarkdown.render('start').html, getMarkdown.render('skills').html]
  }
))

