const showdown = require('showdown')
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const async = require('async')

const config = require('../config')

const ctimeExp = /\[ctime:(\d+)\]/
const paragraphsExp = /<p>(.*)<\/p>/
const titleExp = /<h1( id=\"\w*\")?>(.*)<\/h1>/ // The regex narrow implementation that only works well for showdown

const mdConverter = new showdown.Converter

module.exports = pattern => {
  return new Promise((res, rej) => {
    var md
    glob(`${__dirname}/../../${config.dataDir}/${pattern}.md`, (err, files) => {
      if(err) return rej(err)
      async.map(
        files,
        (file, next) => {
          fs.readFile(file, { encoding: 'utf8' }, (err, data) => {
            if(err) next(err)
            const ctime = new Date()
            const html = mdConverter.makeHtml(data.replace(ctimeExp, ''))
            ctime.setTime((ctimeExp.exec(data) || [])[1] || 0)
            next(null, {
              html,
              paragraphs: paragraphsExp.exec(html),
              title: titleExp.exec(html)[2],
              name: path.basename(file).split('.').slice(0, -1).join('.'),
              ctime,
              file
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

