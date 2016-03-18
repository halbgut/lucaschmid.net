const parallelPromise = require('./lib/parallelPromise')
const getMarkdown = require('./lib/getMarkdown')
const getArticles = require('./lib/getArticles')

module.exports = {
  '/': (params) => [
    'start',
    () => new Promise((resolve, reject) => {
      parallelPromise([
        getMarkdown('start'),
        getMarkdown('skills'),
        getMarkdown('references')
      ])
        .then((mdArr) => {
          resolve({ sections: mdArr.map((md) => md[0].html) })
        })
        .catch(reject)
    })
  ],
  '/projects': (params) => [
    'projects',
    () => new Promise((resolve, reject) => {
      getMarkdown('projects/*')
        .then((mdArr) => resolve({ projects: mdArr.map((md) => md.html) }))
        .catch(reject)
    })
  ],
  '/anotherblog': (params) => [
    'blog',
    () => new Promise((resolve, reject) => {
      getArticles('blog')
        .then((articles) => resolve({ articles }))
        .catch(reject)
    })
  ],
  '/anotherblog/:article': (params) => [
    'blogArticle',
    () => new Promise((resolve, reject) => {
      getArticles('blog')
        .then((articles) =>
          resolve(articles.filter((el) => el.name === params.article)[0])
        )
        .catch(reject)
    }),
    `blogArticle/${params.article}`
  ],
  '/ipa': (params) => [
    'generic',
    () => new Promise((resolve, reject) => {
      getMarkdown('dispo_interaktiver_news_artikel')
        .then((md) => resolve({
          title: 'Interaktiver News-Artikel',
          generic: md[0].html
        }))
        .catch(reject)
    }),
    'ipa'
  ],
  '/peopleidliketoworkwith': (params) => [
    'generic',
    () => new Promise((resolve, reject) => {
      getMarkdown('peopleidliketoworkwith')
        .then((md) => resolve({
          title: 'peopleidliketoworkwith',
          generic: md[0].html
        }))
        .catch(reject)
    })
  ],
  '/blacklist': (params) => [
    'generic',
    () => new Promise((resolve, reject) => {
      resolve({
        title: 'blacklist',
        generic: 'YOLO'
      })
    })
  ]
}

