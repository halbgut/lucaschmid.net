// Github `push` webhook
// This simple writes a file when the hook is called. The systemd-unit defined
// in lucaschmid.net.restart.service pulls the latest version from the github
// repo and restarts the docker container.

const crypto = require('crypto')
const scmp = require('scmp')
const fs = require('fs')

const config = require('../../common/config.js')

module.exports = function *(next) {
  if (
    this.method === 'POST' &&
    this.url === '/restart'
  ) {
    const hmac = crypto.createHmac('sha1', config.restartKey)
    const hash = hmac.update(JSON.stringify(this.request.body))
    if (scmp('sha1=' + hash.digest('hex'), this.request.headers['x-hub-signature'])) {
      fs.writeFileSync('restart', '.')
      this.status = 200
      this.body = ''
    } else {
      yield next
    }
  } else {
    yield next
  }
}

