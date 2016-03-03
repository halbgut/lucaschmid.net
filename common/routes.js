const _ = require('lodash')
const parallelPromise = require('./lib/parallelPromise')
const getMarkdown = require(`./lib/getMarkdown`)
const getArticles = require(`./lib/getArticles`)
const env = require('./lib/env')

module.exports = {
  '/': params => [
    'start',
    () => new Promise((res, rej) => {
      parallelPromise([
        getMarkdown('start'),
        getMarkdown('skills'),
        getMarkdown('references')
      ])
        .then((mdArr) => {
          res({ sections: mdArr.map((md) => md[0].html) })
        })
        .catch(rej)
    })
  ],
  '/projects': params => [
    'projects',
    () => new Promise((res, rej) => {
      getMarkdown('projects/*')
        .then((mdArr) => res({ projects: mdArr.map((md) => md.html) }))
        .catch(rej)
    })
  ],
  '/anotherblog': params => [
    'blog',
    () => new Promise((res, rej) => {
      getArticles('blog')
        .then(articles => res({ articles }))
        .catch(rej)
    })
  ],
  '/anotherblog/:article': params => [
    'blogArticle',
    () => new Promise((res, rej) => {
      getArticles('blog')
        .then(articles =>
          res(articles.filter(el => el.name === params.article)[0])
        )
        .catch(rej)
    }),
    `blogArticle/${params.article}`
  ],
  '/ipa': params => [
    'generic',
    () => new Promise((res, rej) => {
      getMarkdown('dispo_interaktiver_news_artikel')
        .then(md => res({
          title: 'Interaktiver News-Artikel',
          generic: md[0].html
        }))
        .catch(rej)

    }),
    'ipa'
  ],
  '/peopleidliketoworkwith': params => [
    'generic',
    () => new Promise((res, rej) => {
      getMarkdown('peopleidliketoworkwith')
        .then(md => res({
          title: 'peopleidliketoworkwith',
          generic: md[0].html
        }))
        .catch(rej)
    })
  ],
  '/blacklist': params => [
    'generic',
    () => new Promise((res, rej) => {
      res({
        title: 'peopleidliketoworkwith',
        generic: md[0].html
      })
    })
  ]
}

