const showdown = require('showdown')
const fs = require('fs')
const glob = require('glob')
const async = require('async')

const config = require('./config')

const mdConverter = new showdown.Converter

module.exports = pattern => {
  return new Promise((res, rej) => {
    var md
    glob(`${__dirname}/../${config.dataDir}/${pattern}.md`, (err, files) => {
      if(err) return rej(err)
      async.map(
        files,
        (file, next) => {
          fs.readFile(file, { encoding: 'utf8' }, (err, data) => {
            var html
            if(err) next(err)
            html = mdConverter.makeHtml(data),
            next(null, {
              html,
              paragraphs: /<p>(.*)<\/p>/g.exec(html),
              title: /<h1 (id=\"\w*\")?>(.*)<\/h1>/g.exec(html)[2] // The regex narrow implementation that only works well for showdown
            })
          })
        },
        (err, data) => {
          if(err) rej(err)
          res(data)
        }
      )
    })
  })
}

