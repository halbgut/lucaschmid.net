const pug = require('../../common/lib/pug')
const view = require('./view')
const fail = require('./fail')
const getMarkdown = require('./getMarkdown')

module.exports = (context) => new Promise((resolve, reject) => {
  Promise.all([
    getMarkdown('resume/*/*'),
    view.private.getTemplate('resume', false)
  ])
    .then((res) => {
      const languages = []
      const chapters = res[0]
        .sort((c1, c2) => c1.name > c2.name ? 1 : -1)
        .reduce((m, c) => {
          const lang = c.file.split('/').reverse()[1]
          if (languages.indexOf(lang) === -1) languages.push(lang)
          if (!m[c.name]) m[c.name] = c
          if (!m[c.name].texts) m[c.name].texts = {}
          if (!m[c.name].titles) m[c.name].titles = {}
          m[c.name].texts[lang] = { html: c.html, lang }
          m[c.name].titles[lang] = c.title
          return m
        }, {})
      context.status = 200
      context.body = pug(res[1])({
        description: 'My Application for a position as a front-end engineer at Wimdu',
        lang: 'en',
        keywords: 'Application, Résumé, Wimdu, Front-End Engineer, Luca Nils Schmid, Kriegslustig',
        chapters,
        languages
      })
      resolve()
    })
    .catch((err) => resolve(fail(context, err)))
})

