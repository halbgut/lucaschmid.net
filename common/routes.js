const _ = require('lodash')

const config = require(`./config`)
const getMarkdown = require(`./getMarkdown`)

module.exports = {
  '/': [
    'start',
    () => {
      return _.extend(config, {
        sections: [
          getMarkdown.render('start').html,
          getMarkdown.render('skills').html,
          getMarkdown.render('references').html
        ]
      })
    }
  ]
}

