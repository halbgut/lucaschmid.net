const fs = require('fs')

const getArticles = require(`../../common/lib/getArticles`)
const config = require(`../../common/config`)
const rssAtom = require(`./rss-atom`)


module.exports = new Promise((res, rej) => {
  getArticles('blog')
    .then(articles => {
      res(rssAtom.genFeeds(
        {
          title: `${config.title} - Blog`,
          atomId: config.getFullUrl('feed/atom.xml'),
          rssId: config.getFullUrl('feed/rss.xml'),
          subtitle: config.description,
          language: 'en-GB'
        },
        articles.map((article) => {
          return {
            title: article.title,
            id: article.url,
            summary: article.teaser,
            content: article.content,
            author: {
              name: article.author.name,
              uri: article.author.url,
              email: article.author.email
            },
            updated: article.created
          }
        })
      ))
    })
    .catch(rej)
})

