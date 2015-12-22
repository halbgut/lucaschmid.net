var layout = require(`${__dirname}/layout`)
var getMarkdown = require(`${__dirname}/../../common/getMarkdown`)
var fs = require('fs')

process.stdout.write(layout.render(
  './projects',
  {
    projects: getProjects()
  }
))

function getProjects () {
  return fs.readdirSync(`${getMarkdown.getPath()}/projects`).map((file) => {
    return {
      content: getMarkdown.render(`projects/${file}`).html
    }
  })
}

