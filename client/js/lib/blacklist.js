const data = require('../../../common/data/blacklist.json')
const aes = require('../../../common/lib/aes.js')
const view = require('./view.js')

module.exports = () => {
  let key = []
  window.addEventListener('keydown', e => {
    e.preventDefault()
    key.push(e.keyCode)
    const aesWrap = aes(key)
    if (aesWrap) {
      view('blacklist')
        .then(render => {
          render(aesWrap.decrypt(data))
        })
    }
    try {
    } catch (e) {
      console.error(e)
    }
    console.log(key)
  })
}

