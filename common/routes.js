const _ = require('lodash')

const getMarkdown = require(`./getMarkdown`)

module.exports = {
  '/': [
    'start',
    () => {
      return { sections: [
        getMarkdown.render('start').html,
        getMarkdown.render('skills').html,
        getMarkdown.render('references').html
      ] }
    }
  ]
}

