const serverSideMarkdown = '../../server/lib/getMarkdown'
const env = require('./env.js')
if (env === 'server') {
  module.exports = require(serverSideMarkdown)
} else {
  const xhr = require('../../client/js/lib/xhr.js')
  module.exports = (name) => xhr(`/api/md/${name}`)
}

