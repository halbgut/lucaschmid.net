'use strict'
const showdown = require('showdown')
const footnotes = require('showdown-footnotes')
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const async = require('async')
const _ = require('lodash')

const config = require('../../common/config.js')

const paragraphsExp = /<p>(.*)<\/p>/
const titleExp = /<h1( id=\"\w*\")?>(.*)<\/h1>/ // The regex narrow implementation that only works well for showdown

const mdConverter = new showdown.Converter({ extensions: [footnotes] })

const blocks = [
  [
    'ctime',
    /\[ctime:(\d+)\]/,
    (data) => {
      let ctime = new Date()
      ctime.setTime(data[1] || 0)
      return ctime
    }
  ],
  [
    'image',
    /\[image:([^\]]+)\]/,
    (data) => data[1]
  ]
]

module.exports = (pattern) => {
  return new Promise((resolve, reject) => {
    // TODO: Fix this voulnrability
    if (pattern.indexOf('..') > -1) return reject(new Error('.. is not allowed inside a markdown path'))
    glob(`${__dirname}/../../${config.dataDir}/${pattern}.md`, (err, files) => {
      if (err) return reject(err)
      async.map(
        files,
        (file, next) => {
          fs.readFile(file, { encoding: 'utf8' }, (err, data) => {
            if (err) next(err)
            const foundBlocks = {}
            blocks.forEach((block) => {
              foundBlocks[block[0]] = block[2](block[1].exec(data) || [])
              data = data.replace(block[1], '')
            })
            console.log(foundBlocks)
            const html = mdConverter.makeHtml(data)
            next(null, _.assign({
              html,
              paragraphs: paragraphsExp.exec(html),
              title: titleExp.exec(html)[2],
              name: path.basename(file).split('.').slice(0, -1).join('.'),
              file
            }, foundBlocks))
          })
        },
        (err, data) => {
          if (err) reject(err)
          resolve(data)
        }
      )
    })
  })
}

