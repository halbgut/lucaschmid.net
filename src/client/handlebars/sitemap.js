var sitemap = require('sitemap')
var fs = require('fs')

var config = require(`${__dirname}/../../common/config.js`)
var getArticles = require(`${__dirname}/../../common/getArticles.js`)

var urls = [
  { hreflang: 'en-uk', url: config.getFullUrl() },
  { hreflang: 'en-uk', url: config.getFullUrl('projects') },
  { hreflang: 'en-uk', url: config.getFullUrl('anotherblog') }
]

getArticles('blog').forEach((article) => urls.push({ url: article.url }))

sitemapObj = sitemap.createSitemap(
  {
    hostname: `${config.getFullUrl()}`,
    urls
  })
sitemapObj.toXML((err, xml) => {
  if(err) return console.error(err)
  fs.writeFile(config.getBuildPath('sitemap.xml'), xml, () => {})
})

