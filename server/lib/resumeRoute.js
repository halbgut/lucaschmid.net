const pug = require('../../common/lib/pug')
const view = require('./view')
const fail = require('./fail')
const getMarkdown = require('./getMarkdown')

/**
  * This function is called through a caching abstraction
  * so it will only be executed once. Whenever I push to
  * the Master branch on the Github remote, the server
  * restarts and the cache is cleared. I can also manually
  * invalidate the cache using a special route and a secret
  * key. The caching layer is disabled in development.
  */
module.exports = (context) => new Promise((resolve, reject) => {
  Promise.all([
    /* Parse all markdown files in /common/data/resume */
    getMarkdown('resume/*/*'),
    /* Parse the resume Pug template */
    view.private.getTemplate('resume', false)
  ])
    .then((res) => {
      /**
       * All Markdown files inside /common/data/resume were
       * inside directories named after language identifiers.
       * The next block into a structure that is parsable by
       * the template.
       */
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

      /* Set an OK status code */
      context.status = 200
      /* Compile the pug template and execute it */
      context.body = pug(res[1])({
        description: 'My Application for a position as a front-end engineer at Wimdu',
        lang: 'en',
        keywords: 'Application, Résumé, Wimdu, Front-End Engineer, Luca Nils Schmid, Kriegslustig',
        chapters,
        languages
      })
      /* That's it. */
      resolve()
    })
    /**
      * If anything goes wrong, the `fail` function send
      * an appropriate status code and message.
      */
    .catch((err) => resolve(fail(context, err)))
})

